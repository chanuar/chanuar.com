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
    expect(screen.getByText(/normaliza más de 2\.500 skins/)).toBeVisible();
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
    expect(
      screen.getByText(/ciclo superior de DAM.*Ingeniería Informática en la UOC/),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: '¿Hablamos?' })).toBeVisible();
    const technologies = screen.getByRole('list', { name: 'Tecnologías que utilizo' });
    expect(within(technologies).getAllByRole('listitem')).toHaveLength(18);
    expect(technologies.querySelectorAll('img')).toHaveLength(18);
    expect(within(technologies).getByText('Astro')).toBeInTheDocument();
    const pause = screen.getByRole('checkbox', { name: 'Pausar animación de tecnologías' });
    expect(pause).not.toBeChecked();
    pause.focus();
    await user.keyboard('[Space]');
    expect(pause).toBeChecked();
    expect(pause).toHaveAccessibleName('Pausar animación de tecnologías');
    await user.keyboard('[Space]');
    expect(pause).not.toBeChecked();
  });

  it('uses the portfolio shell for unknown routes', () => {
    renderPage('/missing');

    expect(screen.getByRole('heading', { name: 'Esta página no existe.' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Volver al portfolio' })).toHaveAttribute('href', '/');
    expect(document.querySelector('.portfolio-shell')).toBeInTheDocument();
  });

  it('navigates to the English portfolio URL', async () => {
    const user = userEvent.setup();
    renderPage('/');

    await user.click(screen.getByRole('link', { name: 'EN' }));

    expect(await screen.findByText('Full-stack developer')).toBeVisible();
    expect(screen.getByText('Music website · Design and development')).toBeVisible();
    expect(screen.getByText('01 / Selected projects')).toBeVisible();
    expect(
      screen.getByText(/vocational qualification.*DAM.*Computer Engineering at UOC/),
    ).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Pause technology animation' })).toBeVisible();
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
});
