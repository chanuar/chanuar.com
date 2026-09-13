# chanuar.com 👋

This is my portfolio — the place where I share what I build, how I approach software, and the kind of problems I enjoy solving.

I'm a full-stack developer who enjoys building different and interesting things, exploring new technologies n ideas and learning along the way. The website is available in Spanish and English.

## ✨ What's inside

- A bit about me, what I'm working on, and my technical background.
- Some of the products I've built, including their goals, architecture, and tech stack.
- A contact form powered by EmailJS, with direct email as a fallback.
- Canonical metadata, social previews, a sitemap, and structured data.

## 🚀 Projects

| Project       | What is it?                                                              | Repository                                                |
| ------------- | ------------------------------------------------------------------------ | --------------------------------------------------------- |
| **Skinfolio** | A League of Legends cosmetic collection and progression dashboard.       | [chanuar/skinfolio](https://github.com/chanuar/skinfolio) |
| **MenuBox**   | A weekly team-ordering application with public and administrative flows. | [chanuar/MenuBox](https://github.com/chanuar/MenuBox)     |

Skinfolio and MenuBox now live in their own repositories and are developed and versioned independently.

This repository is just for **chanuar.com**.

## 🚧 Repository status

I'm continuing to add content and explore animations with GSAP.

## Building and deployment

`npm run build` runs TypeScript, builds with Vite, then prerenders `/`, `/en`, and
the shared 404 using the same React components and translations. Deploy `dist/`
to Cloudflare Pages with that build command; no production Node server is needed.

The generated HTML includes content, links, and route metadata. React hydrates
it in the browser, then enables the contact form and GSAP. Without JavaScript,
visitors can read the portfolio, change languages, and use the email link.

Keep `404.html` and `public/_redirects` in the output: Cloudflare must return a
real 404 for unknown URLs and redirect `/en/` to `/en`. `npm run dev` continues
to use the static HTML entry metadata and client rendering.

## 🛠️ Tech stack

- React 19
- React Router 7
- TypeScript
- Vite
- GSAP
- i18next
- EmailJS
- Vitest
- Testing Library
- ESLint
- Prettier
- Husky
- lint-staged

## 📬 Say hi

If you want to talk about a project, software, League of Legends, or just say hello:

- [carlos@chanuar.com](mailto:carlos@chanuar.com)
- [GitHub — @chanuar](https://github.com/chanuar)
- [LinkedIn — Carlos Chanuar Martínez](https://www.linkedin.com/in/carlos-chanuar/)
