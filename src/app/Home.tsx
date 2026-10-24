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
        </div>
        <div className="portfolio-hero__layout">
          <div className="portfolio-hero__content">
            <h1 id="portfolio-title" aria-label="Carlos Alberto Chanuar Martínez">
              <span>Carlos</span>
              <span>
                Chanuar<span className="portfolio-hero__dot">.</span>
              </span>
            </h1>
            <p className="portfolio-hero__introduction">{t('home.introduction')}</p>
            <div className="portfolio-hero__links">
              <a className="portfolio-button" href="#proyectos">
                {t('home.viewProjects')} <span aria-hidden="true">↘</span>
              </a>
              <a className="portfolio-text-link" href="#contacto">
                {t('home.contact')} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="portfolio-desk">
            <p className="portfolio-desk__label">
              <span aria-hidden="true">✳</span> {t('home.desk')}
            </p>
            <a className="portfolio-desk__piece portfolio-desk__piece--skinfolio" href="#skinfolio">
              <img
                src="/projects/skinfolio.jpg"
                alt=""
                width="1440"
                height="960"
                fetchPriority="high"
              />
              <span>
                01 / Skinfolio <span aria-hidden="true">↗</span>
              </span>
            </a>
            <a className="portfolio-desk__piece portfolio-desk__piece--menubox" href="#menubox">
              <img src="/projects/menubox-confirm.webp" alt="" width="464" height="976" />
              <span>
                02 / MenuBox <span aria-hidden="true">↗</span>
              </span>
            </a>
            <a
              className="portfolio-desk__piece portfolio-desk__piece--sanriogang"
              href="#sanriogang"
            >
              <img src="/projects/sanriogang.jpg" alt="" width="1440" height="960" />
              <span>
                03 / SanrioGang <span aria-hidden="true">↗</span>
              </span>
            </a>
          </div>
        </div>
        <div className="portfolio-hero__footnote">
          <p className="portfolio-hero__availability">{t('home.currentWork')}</p>
          <a className="portfolio-text-link" href="#experiencia">
            {t('home.explore')} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        id="proyectos"
        className="portfolio-projects"
        aria-labelledby="projects-title"
        tabIndex={-1}
      >
        <div className="portfolio-section-heading">
          <div>
            <p className="portfolio-label">{t('home.projectsLabel')}</p>
            <h2 id="projects-title">{t('home.projectsTitle')}</h2>
          </div>
          <p>{t('home.projectsIntro')}</p>
        </div>
        <div className="portfolio-project-list">
          {PROJECTS.map((project, index) => (
            <article
              id={project.id}
              tabIndex={-1}
              className={`portfolio-project portfolio-project--${project.id}`}
              key={project.id}
            >
              <a
                className="portfolio-project__link"
                href={project.url}
                aria-labelledby={`${project.id}-title`}
                aria-describedby={`${project.id}-summary`}
              >
                <div className="portfolio-project__heading">
                  <span className="portfolio-project__number">0{index + 1}</span>
                  <div className="portfolio-project__title">
                    <p>{t(`home.${project.id}.subtitle`)}</p>
                    <h3 id={`${project.id}-title`}>{project.name}</h3>
                  </div>
                  <span className="portfolio-project__arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="portfolio-project__media">
                  <div className="portfolio-project__media-copy">
                    <span className="portfolio-project__status">{t('home.inUse')}</span>
                    <p>{t(`home.${project.id}.visualTitle`)}</p>
                    <span className="portfolio-project__visit">
                      {t('home.visitProject')} <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                  <div className="portfolio-project__screens">
                    <img
                      className="portfolio-project__preview"
                      src={
                        project.id === 'menubox'
                          ? '/projects/menubox-choose.webp'
                          : `/projects/${project.id}.jpg`
                      }
                      alt=""
                      width={project.id === 'menubox' ? 464 : 1440}
                      height={project.id === 'menubox' ? 976 : 960}
                      loading="lazy"
                    />
                    {project.id === 'menubox' && (
                      <img
                        className="portfolio-project__receipt"
                        src="/projects/menubox-confirm.webp"
                        alt=""
                        width="464"
                        height="976"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </a>
              <div className="portfolio-project__overview">
                <p id={`${project.id}-summary`}>{t(`home.${project.id}.summary`)}</p>
                <ul className="portfolio-tags" aria-label={t('home.technologiesTitle')}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <details className="portfolio-project__details">
                <summary>{t('home.projectDetails', { project: project.name })}</summary>
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
                      {t(
                        `home.${project.id}.${project.id === 'sanriogang' ? 'design' : 'pipeline'}`,
                      )}
                    </p>
                  </div>
                  {project.source && (
                    <div className="portfolio-project__result">
                      <p className="portfolio-label">{t('home.result')}</p>
                      <p className="portfolio-project__copy">{t(`home.${project.id}.result`)}</p>
                    </div>
                  )}
                </div>
              </details>
              {project.source && (
                <div className="portfolio-project__actions">
                  {project.id === 'menubox' && (
                    <button
                      className="portfolio-button portfolio-button--secondary"
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
        id="experiencia"
        className="portfolio-experience"
        aria-labelledby="experience-title"
        tabIndex={-1}
      >
        <h2 id="experience-title" className="portfolio-label">
          {t('home.experience.title')}
        </h2>
        <div className="portfolio-experience__layout">
          <div className="portfolio-experience__position">
            <p className="portfolio-experience__dates">
              <time dateTime="2025">2025</time> — {t('home.experience.present')}
            </p>
            <h3>Bitbox / IKEA</h3>
            <p>Software Developer</p>
          </div>
          <div>
            <p className="portfolio-experience__intro">{t('home.experience.introduction')}</p>
            <ul className="portfolio-experience__achievements">
              {(['support', 'agents', 'data', 'quality', 'modernization', 'backend'] as const).map(
                (achievement) => (
                  <li key={achievement}>
                    <h4>{t(`home.experience.${achievement}.title`)}</h4>
                    <p>{t(`home.experience.${achievement}.description`)}</p>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="tecnologias"
        className="portfolio-technologies"
        aria-labelledby="technologies-title"
        tabIndex={-1}
      >
        <div className="portfolio-section-heading">
          <div>
            <p className="portfolio-label">{t('home.technologiesLabel')}</p>
            <h2 id="technologies-title">{t('home.technologiesTitle')}</h2>
          </div>
          <p>{t('home.technologiesIntro')}</p>
        </div>
        <ul className="portfolio-technologies__list" aria-label={t('home.technologiesList')}>
          {TECHNOLOGIES.map(([name, icon]) => (
            <li key={name}>
              <img src={`/icons/${icon}`} alt="" width="28" height="28" loading="lazy" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="portfolio-education" aria-labelledby="education-title">
        <h2 id="education-title" className="portfolio-label">
          {t('home.education.title')}
        </h2>
        <ul>
          <li>
            <p className="portfolio-label">{t('home.education.current')}</p>
            <h3>{t('home.education.degree')}</h3>
            <p>UOC</p>
            <p>{t('home.education.context')}</p>
          </li>
          <li>
            <p className="portfolio-label">
              <time dateTime="2023">2023</time>–<time dateTime="2025">2025</time>
            </p>
            <h3>{t('home.education.diploma')}</h3>
            <p>CIFP Villa de Agüimes</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
