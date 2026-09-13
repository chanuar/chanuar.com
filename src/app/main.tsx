import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import './i18n';
import { removeStaticMetadata } from './metadata';
import { routes } from './router';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el nodo raíz de la aplicación.');

const app = (
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  removeStaticMetadata();
  createRoot(root).render(app);
}
