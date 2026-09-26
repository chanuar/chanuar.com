import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TECHNOLOGIES = [
  ['PostgreSQL', 'postgresql/postgresql-original.svg'],
  ['Next.js', 'nextjs/nextjs-original.svg'],
  ['Astro', 'astro/astro-original.svg'],
  ['React', 'react/react-original.svg'],
  ['JavaScript', 'javascript/javascript-original.svg'],
  ['TypeScript', 'typescript/typescript-original.svg'],
  ['Java', 'java/java-original.svg'],
  ['Python', 'python/python-original.svg'],
  ['FastAPI', 'fastapi/fastapi-original.svg'],
  ['Spring Boot', 'spring/spring-original.svg'],
  ['HTML', 'html5/html5-original.svg'],
  ['CSS', 'css3/css3-original.svg'],
  ['Node.js', 'nodejs/nodejs-original.svg'],
  ['Vite', 'vitejs/vitejs-original.svg'],
  ['Supabase', 'supabase/supabase-original.svg'],
  ['Git', 'git/git-original.svg'],
  ['GitHub', 'github/github-original.svg'],
  ['Docker', 'docker/docker-original.svg'],
];

const PROJECTS = [
  {
    id: 'skinfolio',
    name: 'Skinfolio',
    url: 'https://skinfolio.chanuar.com',
    source: 'https://github.com/chanuar/skinfolio',
    tags: ['React', 'TypeScript', 'Node.js', 'Supabase'],
  },
  {
    id: 'menubox',
    name: 'MenuBox',
    url: 'https://menubox.chanuar.com',
    source: 'https://github.com/chanuar/MenuBox',
    tags: ['React', 'TypeScript', 'Python', 'Playwright', 'Supabase'],
  },
  {
    id: 'sanriogang',
    name: 'SanrioGang Archive',
    url: 'https://sanriogangarchive.com',
    source: null,
    tags: ['Astro', 'TypeScript', 'HTML', 'CSS'],
  },
] as const;

export function Home() {
  const { t } = useTranslation();
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  return (
    <main id="main-content" className="portfolio-main" tabIndex={-1}>
      <section className="portfolio-hero" aria-labelledby="portfolio-title">
        <div className="portfolio-hero__meta">
          <p className="portfolio-label">{t('home.role')}</p>
          <p className="portfolio-hero__availability">{t('home.currentWork')}</p>
        </div>
        <h1 id="portfolio-title" aria-label="Carlos Alberto Chanuar Martínez">
          <span>
            Carlos Chanuar<span className="portfolio-hero__dot">.</span>
          </span>
        </h1>
        <div className="portfolio-hero__summary">
          <p>{t('home.introduction')}</p>
          <p className="portfolio-hero__education">{t('home.education')}</p>
          <div className="portfolio-hero__links">
            <a className="portfolio-button" href="#proyectos">
              {t('home.explore')} <span aria-hidden="true">↘</span>
            </a>
            <a className="portfolio-button portfolio-button--secondary" href="#contacto">
              {t('home.contact')} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="portfolio-hero__footnote">
          <span>{t('home.areas')}</span>
          <span aria-hidden="true">{t('home.scroll')} ↓</span>
        </div>
      </section>

      <section
        id="proyectos"
        className="portfolio-projects"
        aria-labelledby="projects-title"
        tabIndex={-1}
      >
        <div className="portfolio-section-heading">
          <h2 id="projects-title" className="portfolio-label">
            {t('home.projectsLabel')}
          </h2>
          <p>{t('home.projectsIntro')}</p>
        </div>
        <div className="portfolio-project-list">
          {PROJECTS.map((project, index) => (
            <article
              className={`portfolio-project portfolio-project--${project.id}`}
              key={project.id}
            >
              <a
                className="portfolio-project__link"
                href={project.url}
                aria-labelledby={`${project.id}-title`}
                aria-describedby={`${project.id}-response`}
              >
                <img
                  className="portfolio-project__backdrop"
                  src={`/projects/${project.id}.jpg`}
                  alt=""
                  width="1440"
                  height="960"
                  loading="lazy"
                />
                <img
                  className="portfolio-project__preview"
                  src={`/projects/${project.id}.jpg`}
                  alt=""
                  width="1440"
                  height="960"
                  loading="lazy"
                />
                <div className="portfolio-project__topline">
                  <span className="portfolio-project__number">0{index + 1}</span>
                  <span className="portfolio-project__status">{t('home.inUse')}</span>
                </div>
                <div className="portfolio-project__title">
                  <p>{t(`home.${project.id}.subtitle`)}</p>
                  <h3 id={`${project.id}-title`}>{project.name}</h3>
                  <ul className="portfolio-tags" aria-label={t('home.technologiesTitle')}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <span className="portfolio-project__visit">
                  {t('home.visitProject')}
                  <span className="portfolio-project__arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </a>
              <div className="portfolio-project__story">
                <div>
                  <p className="portfolio-label">{t('home.challenge')}</p>
                  <p className="portfolio-project__copy">{t(`home.${project.id}.challenge`)}</p>
                </div>
                <div>
                  <p className="portfolio-label">
                    {t(project.source ? 'home.contribution' : 'home.response')}
                  </p>
                  <p id={`${project.id}-response`} className="portfolio-project__copy">
                    {t(`home.${project.id}.response`)}
                  </p>
                </div>
                <div>
                  <p className="portfolio-label">
                    {t(
                      `home.${project.id}.${project.id === 'sanriogang' ? 'designLabel' : 'pipelineLabel'}`,
                    )}
                  </p>
                  <p className="portfolio-project__copy">
                    {t(`home.${project.id}.${project.id === 'sanriogang' ? 'design' : 'pipeline'}`)}
                  </p>
                </div>
              </div>
              {project.source && (
                <p className="portfolio-project__result">
                  <strong>{t('home.result')}</strong> {t(`home.${project.id}.result`)}
                </p>
              )}
              {project.source && (
                <div className="portfolio-project__actions">
                  {project.id === 'menubox' && (
                    <button
                      className="portfolio-button"
                      type="button"
                      aria-expanded={walkthroughOpen}
                      aria-controls="menubox-walkthrough"
                      onClick={() => setWalkthroughOpen(!walkthroughOpen)}
                    >
                      {t('home.menubox.walkthrough.toggle')}
                      <span aria-hidden="true">{walkthroughOpen ? '↑' : '↓'}</span>
                    </button>
                  )}
                  <a className="portfolio-project__source" href={project.source}>
                    {t('home.source', { project: project.name })} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
              {project.id === 'menubox' && (
                <section
                  id="menubox-walkthrough"
                  className="portfolio-walkthrough"
                  aria-labelledby="menubox-walkthrough-title"
                  hidden={!walkthroughOpen}
                >
                  <div className="portfolio-walkthrough__heading">
                    <h4 id="menubox-walkthrough-title">{t('home.menubox.walkthrough.title')}</h4>
                    <p>{t('home.menubox.walkthrough.note')}</p>
                  </div>
                  <div className="portfolio-walkthrough__steps">
                    {(['choose', 'review', 'confirm'] as const).map((step, stepIndex) => (
                      <figure key={step}>
                        <h5>
                          <span aria-hidden="true">0{stepIndex + 1}</span>
                          {t(`home.menubox.walkthrough.${step}.title`)}
                        </h5>
                        <a
                          className="portfolio-walkthrough__image"
                          href={`/projects/menubox-${step}.webp`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={t('home.menubox.walkthrough.enlarge', {
                            step: t(`home.menubox.walkthrough.${step}.title`),
                          })}
                        >
                          <img
                            src={`/projects/menubox-${step}.webp`}
                            alt={t(`home.menubox.walkthrough.${step}.alt`)}
                            width="464"
                            height="976"
                            loading="lazy"
                            decoding="async"
                          />
                          <span aria-hidden="true">{t('home.menubox.walkthrough.zoom')} ↗</span>
                        </a>
                        <figcaption>{t(`home.menubox.walkthrough.${step}.caption`)}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}
            </article>
          ))}
        </div>
      </section>

      <section
        id="tecnologias"
        className="portfolio-technologies"
        aria-labelledby="technologies-title"
        tabIndex={-1}
      >
        <div className="portfolio-technologies__heading">
          <p className="portfolio-label">{t('home.technologiesLabel')}</p>
          <h2 id="technologies-title" className="portfolio-visually-hidden">
            {t('home.technologiesTitle')}
          </h2>
          <label className="portfolio-technologies__toggle">
            <input type="checkbox" />
            <span className="portfolio-visually-hidden">{t('home.pause')}</span>
            <span className="portfolio-technologies__pause-icon" aria-hidden="true">
              Ⅱ
            </span>
            <span className="portfolio-technologies__resume-icon" aria-hidden="true">
              ▶
            </span>
          </label>
        </div>
        <div className="portfolio-technologies__viewport">
          <div className="portfolio-technologies__track">
            <ul aria-label={t('home.technologiesList')}>
              {TECHNOLOGIES.map(([name, icon]) => (
                <li key={name}>
                  <img src={`/icons/${icon}`} alt="" width="72" height="72" loading="lazy" />
                  <span className="portfolio-technology__name">{name}</span>
                </li>
              ))}
            </ul>
            <ul aria-hidden="true">
              {TECHNOLOGIES.map(([name, icon]) => (
                <li key={name}>
                  <img src={`/icons/${icon}`} alt="" width="72" height="72" loading="lazy" />
                  <span className="portfolio-technology__name">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
