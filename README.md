# chanuar.com

A band archive, a pharmacy floor plan, a League collection and a lunch order all share a front page. This is my portfolio, in [Spanish](https://chanuar.com/) and [English](https://chanuar.com/en).

## Take a look

- [SanrioGang Archive](https://sanriogangarchive.com) collects the band's songs, photos and inside jokes.
- [RTLS](https://github.com/chanuar/rtls-frontend) turns radio measurements into a route you can replay.
- [Skinfolio](https://skinfolio.chanuar.com) shows which skins I own and which champions are one skin from completion.
- [MenuBox](https://menubox.chanuar.com) keeps the team's lunch orders on one ticket.

## Run locally

Use Node 24.21.0 and npm.

```sh
npm ci
npm run dev
```

The site works locally with a direct email link. To enable the contact form, copy `.env.example` to `.env` and supply your EmailJS settings.

`npm test` runs the tests. `npm run build` type-checks the app and prerenders the Spanish, English and 404 pages. Deploy `dist/` to Cloudflare Pages, including `404.html` and `_redirects`.
