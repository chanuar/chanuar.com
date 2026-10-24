import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from './router';

function renderPage(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('portfolio surfaces', () => {
  it('keeps section links in sync with the router and smooth scrolling', async () => {
    const user = userEvent.setup();
    const router = renderPage('/');
    const smoother = ScrollSmoother.get();
    if (!smoother) throw new Error('Missing scroll smoother');
    const scroll = vi.spyOn(smoother, 'scrollTo');
    try {
      const contact = screen.getByRole('link', { name: 'Contacto' });
      contact.focus();
      await user.keyboard('[Enter]');
      expect(router.state.location.hash).toBe('#contacto');
      expect(scroll).toHaveBeenCalledWith(expect.any(Number), true);
      expect(screen.getByRole('contentinfo')).toHaveFocus();
      await user.tab();
      expect(document.activeElement).toHaveAttribute('href', 'mailto:carlos@chanuar.com');
      await act(() => router.navigate(-1));
      expect(router.state.location.hash).toBe('');
      expect(scroll).toHaveBeenLastCalledWith(0, true);
      await act(() => router.navigate(1));
      expect(router.state.location.hash).toBe('#contacto');
      scroll.mockClear();
      await user.click(contact);
      expect(scroll).toHaveBeenCalledWith(expect.any(Number), true);
      await user.click(screen.getByRole('link', { name: 'Saltar al contenido' }));
      expect(screen.getByRole('main')).toHaveFocus();
      expect(router.state.location.hash).toBe('#main-content');
      await user.click(screen.getByRole('link', { name: 'Ver mi experiencia' }));
      expect(router.state.location.hash).toBe('#experiencia');
      expect(screen.getByRole('region', { name: 'Experiencia profesional' })).toHaveFocus();
    } finally {
      scroll.mockRestore();
    }
  });

  it('presents the owner, contact links, and all three projects', async () => {
    const user = userEvent.setup();
    renderPage('/');

    expect(screen.getByRole('heading', { name: 'Carlos Alberto Chanuar Martínez' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/chanuar',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/carlos-chanuar/',
    );
    expect(screen.getByRole('link', { name: 'Proyectos' })).toHaveAttribute('href', '/#proyectos');
    expect(screen.getByRole('link', { name: 'Stack' })).toHaveAttribute('href', '/#tecnologias');
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/#contacto');
    expect(screen.getByRole('link', { name: 'Skinfolio' })).toHaveAttribute(
      'href',
      'https://skinfolio.chanuar.com',
    );
    expect(screen.getByRole('link', { name: 'MenuBox' })).toHaveAttribute(
      'href',
      'https://menubox.chanuar.com',
    );
    await user.click(screen.getByText('Dentro de Skinfolio: decisiones y desarrollo'));
    expect(screen.getByText(/collector en Node.js que sincroniza mi colección/)).toBeVisible();
    await user.click(screen.getByText('Dentro de MenuBox: decisiones y desarrollo'));
    expect(screen.getByText(/horarios públicos de 14 restaurantes/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ver código de MenuBox' })).toHaveAttribute(
      'href',
      'https://github.com/chanuar/MenuBox',
    );
    expect(screen.getByRole('link', { name: 'Ver código de Skinfolio' })).toHaveAttribute(
      'href',
      'https://github.com/chanuar/skinfolio',
    );
    await user.click(screen.getByRole('link', { name: 'Contactar' }));
    expect(screen.getByRole('contentinfo')).toHaveFocus();
    expect(screen.getByRole('link', { name: 'SanrioGang Archive' })).toHaveAttribute(
      'href',
      'https://sanriogangarchive.com',
    );
    expect(screen.getByText('Web musical · Diseño y desarrollo')).toBeVisible();
    expect(screen.getByText('01 / Proyectos seleccionados')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Ingeniería Informática' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '¿Hablamos?' })).toBeVisible();
    const technologies = screen.getByRole('list', { name: 'Tecnologías que utilizo' });
    expect(within(technologies).getAllByRole('listitem')).toHaveLength(18);
    expect(technologies.querySelectorAll('img')).toHaveLength(18);
    expect(within(technologies).getByText('Astro')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it.each([
    ['/', 'Experiencia profesional', 'Formación', 'Ver mi experiencia', 'actualidad'],
    ['/en', 'Professional experience', 'Education', 'View my experience', 'present'],
  ])(
    'presents professional experience and education at %s',
    async (path, title, educationTitle, link, present) => {
      const user = userEvent.setup();
      const router = renderPage(`${path}#experiencia`);
      const experience = screen.getByRole('region', { name: title });
      expect(within(experience).getByRole('heading', { name: 'Bitbox / IKEA' })).toBeVisible();
      expect(within(experience).getByText('Software Developer')).toBeVisible();
      expect(experience).toHaveTextContent(`2025 — ${present}`);
      expect(within(experience).getAllByRole('listitem')).toHaveLength(6);
      const projects = screen.getByRole('region', {
        name: path === '/' ? 'Proyectos' : 'Projects',
      });
      expect(projects.compareDocumentPosition(experience)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

      expect(screen.getByRole('link', { name: link })).toHaveAttribute('href', '#experiencia');

      const education = screen.getByRole('region', { name: educationTitle });
      expect(within(education).getAllByRole('listitem')).toHaveLength(2);
      expect(within(education).getByText('UOC')).toBeVisible();
      expect(within(education).getByText('CIFP Villa de Agüimes')).toBeVisible();
      expect(education).toHaveTextContent('2023–2025');

      const language = screen.getByRole('link', { name: path === '/' ? 'EN' : 'ES' });
      await user.click(language);
      expect(router.state.location.hash).toBe('#experiencia');
      expect(language).toHaveFocus();
      expect(
        screen.getByRole('heading', { name: path === '/' ? 'Education' : 'Formación' }),
      ).toBeVisible();
    },
  );

  it('links the desk previews to focusable projects and preserves expanded details across languages', async () => {
    const user = userEvent.setup();
    const router = renderPage('/');
    await user.click(screen.getByRole('link', { name: '02 / MenuBox' }));
    expect(router.state.location.hash).toBe('#menubox');
    expect(document.getElementById('menubox')).toHaveFocus();
    const project = document.getElementById('menubox');
    if (!project) throw new Error('Missing MenuBox project');
    const details = within(project).getByText('Dentro de MenuBox: decisiones y desarrollo');
    const contribution = within(project).getByText(/horarios públicos de 14 restaurantes/);
    expect(contribution).not.toBeVisible();
    await user.click(details);
    expect(contribution).toBeVisible();
    expect(project.querySelector('.portfolio-project__preview')).toHaveAttribute(
      'src',
      '/projects/menubox-choose.webp',
    );
    await user.click(screen.getByRole('link', { name: 'EN' }));
    expect(within(project).getByText('Inside MenuBox: decisions and development')).toBeVisible();
    expect(
      within(project).getByText(/^I built the ordering flow, administration tools/),
    ).toBeVisible();
    expect(project.querySelector('details')).toHaveAttribute('open');
  });

  it('uses the portfolio shell for unknown routes', () => {
    renderPage('/missing');

    expect(screen.getByRole('heading', { name: 'Esta página no existe.' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Volver al portfolio' })).toHaveAttribute('href', '/');
    expect(document.querySelector('.portfolio-shell')).toBeInTheDocument();
  });

  it('opens the MenuBox walkthrough with the keyboard and translates its content', async () => {
    const user = userEvent.setup();
    renderPage('/');
    const toggle = screen.getByRole('button', { name: 'Ver cómo funciona' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region', { name: 'De elegir a tenerlo apuntado.' })).toBeNull();

    toggle.focus();
    await user.keyboard('[Enter]');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveFocus();
    const tour = screen.getByRole('region', { name: 'De elegir a tenerlo apuntado.' });
    expect(within(tour).getAllByRole('img')).toHaveLength(3);
    expect(within(tour).getAllByRole('link', { name: /Ampliar captura:/ })).toHaveLength(3);
    for (const image of within(tour).getAllByRole('img')) {
      expect(image).toHaveAttribute('loading', 'lazy');
    }
    await user.keyboard('[Space]');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(tour).not.toBeVisible();

    await user.click(screen.getByRole('link', { name: 'EN' }));
    await user.click(screen.getByRole('button', { name: 'See how it works' }));
    expect(screen.getByRole('heading', { name: /Choose your dishes/ })).toBeVisible();
    expect(screen.getByText('Real interface · Sample order · App in Spanish')).toBeVisible();
    expect(screen.getAllByRole('link', { name: /Enlarge screenshot:/ })).toHaveLength(3);
  });

  it('navigates to the English portfolio URL', async () => {
    const user = userEvent.setup();
    renderPage('/');

    await user.click(screen.getByRole('link', { name: 'EN' }));

    expect(await screen.findByText('Full-stack developer')).toBeVisible();
    expect(screen.getByText('Music website · Design and development')).toBeVisible();
    expect(screen.getByText('01 / Selected projects')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Computer Engineering' })).toBeVisible();
    expect(screen.getByRole('list', { name: 'Technologies I use' })).toBeVisible();
    expect(screen.getByText('All fields are required.')).toBeVisible();
    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription(
      'Between 10 and 2000 characters.',
    );
    expect(
      screen.getByText(/Your name, email address and message reach my inbox through EmailJS/),
    ).toBeVisible();
    expect(screen.getByText('More about your data')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/en#proyectos');
    expect(screen.getByRole('link', { name: 'ES' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'page');
    expect(document.documentElement).toHaveAttribute('lang', 'en');
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      'en_US',
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://chanuar.com/en',
    );
  });

  it.each(['', '#proyectos', '#contacto'])(
    'keeps scroll, focus and expanded content when switching languages at %s',
    async (hash) => {
      const user = userEvent.setup();
      const router = renderPage(`/?ref=portfolio${hash}`);
      await user.click(screen.getByRole('button', { name: 'Ver cómo funciona' }));
      const smoother = ScrollSmoother.get();
      if (!smoother) throw new Error('Missing scroll smoother');
      const scroll = vi.spyOn(smoother, 'scrollTo');
      const focusMain = vi.spyOn(screen.getByRole('main'), 'focus');
      // jsdom has no layout; the fixed language controls are always in view.
      const languageBounds = ['ES', 'EN'].map((label) =>
        vi
          .spyOn(screen.getByRole('link', { name: label }), 'getBoundingClientRect')
          .mockReturnValue(new DOMRect(0, 16, 44, 42)),
      );
      try {
        for (const label of ['EN', 'ES', 'ES', 'EN']) {
          await user.click(screen.getByRole('link', { name: label }));
          expect(router.state.location.pathname).toBe(label === 'EN' ? '/en' : '/');
          expect(router.state.location.hash).toBe(hash);
          expect(router.state.location.search).toBe('?ref=portfolio');
          expect(screen.getByRole('link', { name: label })).toHaveFocus();
          expect(
            screen.getByRole('button', {
              name: label === 'EN' ? 'See how it works' : 'Ver cómo funciona',
            }),
          ).toHaveAttribute('aria-expanded', 'true');
          expect(scroll).not.toHaveBeenCalled();
          expect(focusMain).not.toHaveBeenCalled();
        }
        await act(() => router.navigate(-1));
        await act(() => router.navigate(1));
        expect(scroll).not.toHaveBeenCalled();
        expect(focusMain).not.toHaveBeenCalled();
      } finally {
        scroll.mockRestore();
        focusMain.mockRestore();
        languageBounds.forEach((bounds) => bounds.mockRestore());
      }
    },
  );
});
