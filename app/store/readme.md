# Pinia stores

Place stores in `app/stores/` (auto-imported by `@pinia/nuxt`).

## User store (`user.ts`)

- Shares `firstName` and `preferredLanguage` across pages (navbar, home, login).
- Persistence: `pinia-plugin-persistedstate` saves those fields to `localStorage` (key `horizons_user`), so the session survives a page reload.
- `disconnect()` clears the state and the saved session.
