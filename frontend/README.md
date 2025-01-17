# Deploying frontend application to production

### Rewrite the static site frontend to fetch the index page, before loading what the user requested

https://docs.render.com/redirects-rewrites

**Rewrite** - Does not redirect the browser. Instead, your site serves the content from the rule’s destination at the original path. The browser can’t detect that content was served from a different path or URL.

Create a rewrite rule if:

You want to serve the same content from multiple paths.
Your static site uses a framework with [client-side routing](https://facebook.github.io/create-react-app/docs/deployment#serving-apps-with-client-side-routing) (such as [react-router](https://github.com/ReactTraining/react-router) or [Vue Router](https://router.vuejs.org/)), and you’ll handle all requests from a single path like /index.html.

## Solution => For Frontend Application => Rewrite EVERY url to root `/*` => `/`

Fixing the 'cannot GET /URL' error on refresh with React Router (or how client side routers work) - https://ui.dev/react-router-cannot-get-url-refresh

# Running Frontend Application (using Docker)

1. Create `.env` file in `frontend/` directory with `VITE_PROD_BACKEND_URL='???'` if needed (not required for local testing) - https://vite.dev/guide/env-and-mode#env-files
2. Install docker on your system
3. Navigate to the project root directory where the `docker-compose.yaml` file is present
4. Run `docker compose up`
5. To access the frontend app, you can visit the reverse proxy port e.g. `localhost:8080/`. The reverse proxy port is running on the port defined in `docker-compose.yaml`. A request can be made to this port on localhost (for local testing)

You can clean up docker images / containers etc using `docker system prune` (e.g. that are exited)

```shell
docker system prune
docker compose up
```

# Running Tests

1. In `frontend/` directory, perform install of dependencies using `npm install`
2. Run `npm run test` (Playwright ui will be launched, the frontend will be automatically launched using `playwright.config.ts` as a web server - https://playwright.dev/docs/test-webserver)

# References

Favicon generated from https://favicon.io/emoji-favicons/robot

1. Fixing playwright.config.ts, add to `tsconfig.app.json` and `tsconfig.json` - https://stackoverflow.com/questions/53529521/typescript-error-cannot-find-name-process
   https://stackoverflow.com/a/78626067

2. Authentication with React Router v6: A complete guide - https://blog.logrocket.com/authentication-react-router-v6/
3. How should the createBrowserRouter and RouterProvider be use with application context - https://stackoverflow.com/questions/75652431/how-should-the-createbrowserrouter-and-routerprovider-be-use-with-application-co
4. Data Fetching and Aborting requests - https://www.youtube.com/watch?v=00lxm_doFYw
   - https://github.com/sindresorhus/ky?tab=readme-ov-file#cancellation
5. Handling React useEffect firing twice due to Strict Mode - https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
6. check two TextField have the same value with react-hook-form - https://stackoverflow.com/questions/63096634/check-two-textfield-have-the-same-value-with-react-hook-form
7. Protected Routes in React Router - https://www.angularminds.com/blog/protected-routes-in-react-router-authentication-and-authorization

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react"

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
})
```
