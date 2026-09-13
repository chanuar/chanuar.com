import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { routes } from './router';

export async function renderDocument(path: string) {
  const language = path === '/en' ? 'en' : 'es';
  const translations = i18n.cloneInstance();
  await translations.changeLanguage(language);
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(path, 'https://chanuar.com')));
  if (context instanceof Response) throw new Error(`Unexpected redirect rendering ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context);

  return (
    '<!doctype html>' +
    renderToString(
      <html lang={language}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className="portfolio-page">
          <div id="root">
            <I18nextProvider i18n={translations}>
              <StaticRouterProvider router={router} context={context} hydrate={false} />
            </I18nextProvider>
          </div>
        </body>
      </html>,
    )
  );
}
