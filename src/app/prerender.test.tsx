import { StrictMode } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { renderDocument } from './prerender';
import { routes } from './router';
import i18n from './i18n';

let root: Root | undefined;

afterEach(() => {
  act(() => root?.unmount());
  root = undefined;
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it.each([
  ['/', '/', 'es', 'Carlos Alberto Chanuar Martínez'],
  ['/en', '/en', 'en', 'Carlos Alberto Chanuar Martínez'],
  ['/404.html', '/unknown/deep/path', 'es', 'Esta página no existe.'],
  ['/404.html', '/en/missing', 'es', 'Esta página no existe.'],
] as const)(
  'hydrates %s at %s without replacing its content',
  async (page, path, language, heading) => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service_test');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'template_test');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'public_test');
    const html = new DOMParser().parseFromString(await renderDocument(page), 'text/html');
    document.documentElement.lang = html.documentElement.lang;
    document.head.innerHTML = html.head.innerHTML;
    document.body.innerHTML = html.body.innerHTML;
    await i18n.changeLanguage(language);

    const main = screen.getByRole('main');
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    expect(document.querySelectorAll('main#main-content')).toHaveLength(1);
    expect(document.querySelector('fieldset')).toBeDisabled();
    expect(document.querySelector('button[type="submit"]')).toBeDisabled();
    expect(document.querySelector('a[href="mailto:carlos@chanuar.com"]')).toBeVisible();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      page === '/404.html' ? 'noindex, nofollow' : undefined,
    );
    if (page !== '/404.html') {
      expect(screen.getByRole('link', { name: 'Skinfolio' })).toHaveAttribute(
        'href',
        'https://skinfolio.chanuar.com',
      );
      expect(screen.getByRole('link', { name: 'MenuBox' })).toHaveAttribute(
        'href',
        'https://menubox.chanuar.com',
      );
      expect(screen.getByRole('link', { name: 'SanrioGang Archive' })).toHaveAttribute(
        'href',
        'https://sanriogangarchive.com',
      );
      expect(screen.getByText(/DAM.*UOC/)).toBeVisible();
      expect(document.querySelectorAll('.portfolio-project__preview')).toHaveLength(3);
      expect(
        screen.getByRole('list', {
          name: language === 'en' ? 'Technologies I use' : 'Tecnologías que utilizo',
        }).children,
      ).toHaveLength(18);
    }

    const container = document.getElementById('root');
    if (!container) throw new Error('Missing prerendered root');
    const onRecoverableError = vi.fn();
    const consoleError = vi.spyOn(console, 'error');
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    act(() => {
      root = hydrateRoot(
        container,
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>,
        {
          onRecoverableError,
        },
      );
    });

    expect(screen.getByRole('main')).toBe(main);
    expect(document.querySelector('button[type="submit"]')).toBeEnabled();
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();

    const user = userEvent.setup();
    for (const [label, canonical] of [
      ['EN', 'https://chanuar.com/en'],
      ['ES', 'https://chanuar.com/'],
    ]) {
      await user.click(screen.getByRole('link', { name: label }));
      await waitFor(() =>
        expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', canonical),
      );
      expect(document.querySelectorAll('title')).toHaveLength(1);
      expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
      expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
      expect(document.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(3);
      expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
      expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
    }
  },
);
