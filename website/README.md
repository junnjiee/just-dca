# just:dca Website

The website is built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/), and hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

## Getting Started

This guide assumes you have [Node.js](https://nodejs.org/en) >= 18 and [pnpm](https://pnpm.io/) installed.

1. Copy `.env.example` and rename to `.env`

2. Install project dependencies

```shell
pnpm i
```

3. Run the local development server using [Vite](https://vite.dev/)

```shell
pnpm run dev
```

4. Build for production using [Vite](https://vite.dev/)

```shell
pnpm run ci
```

This command runs linting, testing and building steps sequentially.

Currently, [Vite](https://vite.dev/) uses [Rollup](https://rollupjs.org/) for bundling, but this may be changed in the future with the introduction of [Rolldown](https://rolldown.rs/) (A shiny new Rust-based bundler).

## Additional Information

[React Query](https://tanstack.com/query/latest) and [zod](https://zod.dev/) are used to fetch and parse the API data respectively.

[TailwindCSS](https://tailwindcss.com/) is used for styling. The application also uses [shadcn/ui](https://ui.shadcn.com/) components.

[Recharts](https://recharts.org/en-US/) is the charting library of choice.

## Developer Tooling

The [Vitest](https://vitest.dev/) environment has been set-up for the application. Currently, tests are only written for the `DashboardForm` component. Test files are co-located with the component file.

Formatting is done with [Prettier](https://prettier.io/) and some basic [ESLint](https://eslint.org/) rules have been set-up.

[Knip](https://github.com/webpro-nl/knip) (amazing tool honestly) is used to find unused dependencies and exports in the codebase.

To run the knip tool:

```
pnpm run knip
```
