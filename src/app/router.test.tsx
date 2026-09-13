import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, Link, matchRoutes, RouterProvider } from 'react-router';
import { routes } from './router';
import { RouteEnvironment, type Page } from './RouteEnvironment';
import { RouteError } from './RouteError';
import { removeStaticMetadata } from './metadata';
import spanishEntry from '../../index.html?raw';
import englishEntry from '../../en.html?raw';
import notFoundEntry from '../../404.html?raw';

afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
  vi.restoreAllMocks();
});

describe('application router', () => {
  it.each([
    ['/', 'home', spanishEntry],
    ['/en', 'home', englishEntry],
    ['/missing', 'notFound', notFoundEntry],
  ] as const)('keeps HTML and client metadata consistent at %s', (path, page, html) => {
    const entry = new DOMParser().parseFromString(html, 'text/html');
    document.head.innerHTML = entry.head.innerHTML;
    removeStaticMetadata();
    const router = createMemoryRouter(
      [
        {
          Component: RouteEnvironment,
          children: [{ path, handle: page satisfies Page, element: <div>ready</div> }],
        },
      ],
      { initialEntries: [path] },
    );
    render(<RouterProvider router={router} />);

    expect(document.title).toBe(entry.title);
    expect(document.querySelectorAll('title')).toHaveLength(1);
    expect(document.querySelector('meta[charset]')).toHaveAttribute('charset', 'UTF-8');
    expect(document.querySelector('meta[name="viewport"]')).toHaveAttribute(
      'content',
      'width=device-width, initial-scale=1.0',
    );
    for (const tag of entry.querySelectorAll('meta[name], meta[property], link[rel="canonical"]')) {
      const attribute = tag.hasAttribute('name')
        ? 'name'
        : tag.hasAttribute('property')
          ? 'property'
          : 'rel';
      if (tag.getAttribute('name') === 'viewport') continue;
      const selector = `${tag.localName}[${attribute}="${tag.getAttribute(attribute)}"]`;
      expect(document.querySelectorAll(selector)).toHaveLength(1);
      expect(document.querySelector(selector)).toHaveAttribute(
        tag.localName === 'link' ? 'href' : 'content',
        tag.getAttribute(tag.localName === 'link' ? 'href' : 'content'),
      );
    }
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `https://chanuar.com/${page === 'home' ? 'portfolio-og.png' : 'favicon.svg'}`,
    );
    const schema = entry.querySelector('script[type="application/ld+json"]');
    if (schema) {
      expect(
        JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent ?? ''),
      ).toEqual(JSON.parse(schema.textContent));
    }
  });

  it.each([
    ['/', spanishEntry],
    ['/en', englishEntry],
    ['/missing', notFoundEntry],
  ] as const)(
    'keeps metadata current after navigating from the HTML entry at %s',
    async (path, html) => {
      const entry = new DOMParser().parseFromString(html, 'text/html');
      document.head.innerHTML = entry.head.innerHTML;
      removeStaticMetadata();
      const router = createMemoryRouter(routes, { initialEntries: [path] });
      render(<RouterProvider router={router} />);
      const user = userEvent.setup();

      for (const [label, target, language, locale, jobTitle] of [
        ['EN', '/en', 'en', 'en_US', 'Full-stack developer'],
        ['ES', '/', 'es', 'es_ES', 'Desarrollador full stack'],
      ] as const) {
        await user.click(screen.getByRole('link', { name: label }));

        expect(document.documentElement).toHaveAttribute('lang', language);
        expect(document.querySelectorAll('title')).toHaveLength(1);
        expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
        expect(document.querySelectorAll('meta[property="og:locale"]')).toHaveLength(1);
        expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
          'content',
          locale,
        );
        expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
          'href',
          `https://chanuar.com${target}`,
        );
        expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
        expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(3);
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        expect(schemas).toHaveLength(1);
        expect(JSON.parse(schemas[0]?.textContent ?? '')).toMatchObject({
          '@type': 'ProfilePage',
          url: `https://chanuar.com${target}`,
          mainEntity: { '@type': 'Person', jobTitle },
        });
      }

      await act(() => router.navigate('/missing-again'));
      expect(document.querySelectorAll('title')).toHaveLength(1);
      expect(document.title).toBe('Página no encontrada - chanuar.com');
      expect(document.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
      expect(document.querySelector('link[rel="alternate"][hreflang]')).not.toBeInTheDocument();
      expect(document.querySelector('script[type="application/ld+json"]')).not.toBeInTheDocument();

      await user.click(screen.getByRole('link', { name: 'Volver al portfolio' }));
      expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://chanuar.com/',
      );
    },
  );

  it.each(['/', '/en'])('matches the portfolio URL %s', (path) => {
    const matches = matchRoutes(routes, path);
    expect(matches).toBeTruthy();
    expect(matches?.some((match) => match.route.path === '*')).toBe(false);
  });

  it('uses the catch-all route for direct unknown loads', () => {
    for (const path of ['/missing', '/skinfolio', '/food', '/food/options', '/food/admin']) {
      expect(matchRoutes(routes, path)?.at(-1)?.route.path).toBe('*');
    }
  });

  it('shows a safe fallback when a route fails to render', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    document.head.innerHTML = new DOMParser().parseFromString(
      spanishEntry,
      'text/html',
    ).head.innerHTML;
    removeStaticMetadata();
    function BrokenRoute(): never {
      throw new Error('private error details');
    }
    const router = createMemoryRouter([
      { path: '/', Component: BrokenRoute, ErrorBoundary: RouteError },
    ]);

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Algo salió mal.' })).toBeVisible();
    expect(screen.queryByText('private error details')).not.toBeInTheDocument();
    expect(document.querySelectorAll('title')).toHaveLength(1);
    expect(document.title).toBe('Algo salió mal - chanuar.com');
    expect(document.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    expect(document.querySelector('script[type="application/ld+json"]')).not.toBeInTheDocument();
    expect(document.querySelector('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  });

  it.each([
    ['home', '/', 'Carlos Chanuar | Software Developer', '#08090b', '/', 'es_ES'],
    ['home', '/en', 'Carlos Chanuar | Software Developer', '#08090b', '/en', 'en_US'],
    ['notFound', '/missing', 'Página no encontrada - chanuar.com', '#08090b', null, 'es_ES'],
  ] as const)(
    'applies %s metadata at %s',
    async (page, path, title, theme, canonicalPath, locale) => {
      const router = createMemoryRouter(
        [
          {
            Component: RouteEnvironment,
            children: [{ path, handle: page satisfies Page, element: <div>ready</div> }],
          },
        ],
        { initialEntries: [path] },
      );
      render(<RouterProvider router={router} />);
      await waitFor(() => expect(document.title).toBe(title));
      expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', theme);
      expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        locale,
      );
      expect(document.querySelectorAll('link[rel="preload"][as="font"]')).toHaveLength(0);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonicalPath) {
        expect(canonical).toHaveAttribute('href', `https://chanuar.com${canonicalPath}`);
      } else {
        expect(canonical).not.toBeInTheDocument();
      }
      if (page === 'notFound')
        expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
          'content',
          'noindex, nofollow',
        );
    },
  );

  it('moves focus to the main content after client-side navigation', async () => {
    const router = createMemoryRouter([
      {
        Component: RouteEnvironment,
        children: [
          {
            index: true,
            handle: 'home' satisfies Page,
            element: (
              <main id="main-content" tabIndex={-1}>
                <Link to="/next">Siguiente página</Link>
              </main>
            ),
          },
          {
            path: 'next',
            handle: 'home' satisfies Page,
            element: (
              <main id="main-content" tabIndex={-1}>
                <h1>Siguiente página</h1>
              </main>
            ),
          },
        ],
      },
    ]);
    render(<RouterProvider router={router} />);

    await userEvent.click(screen.getByRole('link', { name: 'Siguiente página' }));

    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
  });
});
