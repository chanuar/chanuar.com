import type { MouseEvent } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { ContactForm } from './ContactForm';
import './portfolio.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

export function PortfolioShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const homePath = location.pathname === '/en' ? '/en' : '/';

  function scrollToAnchor(hash: string) {
    const target = document.getElementById(hash.slice(1));
    const smoother = ScrollSmoother.get();
    if (!smoother || (hash && !target)) return;
    const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) || 0 : 0;
    smoother.scrollTo(
      target ? Math.max(0, smoother.offset(target, 'top top') - margin) : 0,
      !matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }

  function handleAnchorClick(event: MouseEvent<HTMLElement>) {
    const anchor = event.target instanceof Element ? event.target.closest('a') : null;
    if (
      !(anchor instanceof HTMLAnchorElement) ||
      anchor.closest('.portfolio-language') ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.origin !== window.location.origin ||
      anchor.pathname !== location.pathname ||
      !anchor.hash ||
      !document.getElementById(anchor.hash.slice(1))
    )
      return;
    event.preventDefault();
    document.getElementById(anchor.hash.slice(1))?.focus({ preventScroll: true });
    if (anchor.hash === location.hash) scrollToAnchor(anchor.hash);
    else void navigate(anchor.hash, { preventScrollReset: true });
  }

  useGSAP(() => {
    gsap.matchMedia().add(
      {
        allowMotion: '(prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      ({ conditions }) => {
        ScrollSmoother.create({
          smooth: conditions?.reduceMotion ? 0 : 1,
          effects: !conditions?.reduceMotion,
        });
      },
    );
  });
  useGSAP(() => scrollToAnchor(location.hash), {
    dependencies: [location.hash],
  });
  return (
    <>
      <a className="portfolio-skip" href="#main-content" onClick={handleAnchorClick}>
        {t('shell.skip')}
      </a>
      <header className="portfolio-header" onClick={handleAnchorClick}>
        <NavLink className="portfolio-brand" to={homePath} end aria-label={t('shell.home')}>
          <span aria-hidden="true">C.</span>
          <span>@chanuar</span>
        </NavLink>
        <div className="portfolio-header__actions">
          <nav aria-label={t('shell.navigation')}>
            <a href={`${homePath}#proyectos`}>
              <span className="portfolio-nav__number" aria-hidden="true">
                01
              </span>
              {t('shell.projects')}
            </a>
            <a href={`${homePath}#tecnologias`}>
              <span className="portfolio-nav__number" aria-hidden="true">
                02
              </span>
              {t('shell.stack')}
            </a>
            <a href={`${homePath}#contacto`}>
              <span className="portfolio-nav__number" aria-hidden="true">
                03
              </span>
              {t('shell.contact')}
            </a>
          </nav>
          <nav className="portfolio-language" aria-label={t('language')}>
            <NavLink
              to={{ pathname: '/', search: location.search, hash: location.hash }}
              preventScrollReset
              end
              hrefLang="es"
              lang="es"
            >
              ES
            </NavLink>
            <NavLink
              to={{ pathname: '/en', search: location.search, hash: location.hash }}
              preventScrollReset
              end
              hrefLang="en"
              lang="en"
            >
              EN
            </NavLink>
          </nav>
        </div>
      </header>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="portfolio-shell" onClick={handleAnchorClick}>
            <Outlet />
            <footer
              id="contacto"
              className="portfolio-footer"
              aria-labelledby="contact-title"
              tabIndex={-1}
            >
              <div className="portfolio-contact__intro">
                <p className="portfolio-label">{t('shell.contactLabel')}</p>
                <h2 id="contact-title">{t('shell.contactTitle')}</h2>
                <p className="portfolio-contact__copy">{t('shell.contactCopy')}</p>
                <a className="portfolio-contact__fallback" href="mailto:carlos@chanuar.com">
                  carlos@chanuar.com <span aria-hidden="true">↗</span>
                </a>
              </div>
              <ContactForm />
              <div className="portfolio-footer__meta">
                <span suppressHydrationWarning>© {new Date().getFullYear()} Carlos Chanuar</span>
                <a href="https://github.com/chanuar" rel="me">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/carlos-chanuar/" rel="me">
                  LinkedIn
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
