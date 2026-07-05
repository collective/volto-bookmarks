# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`volto-bookmarks` is a Plone Volto add-on that lets logged-in users bookmark pages and searches (including searchkit queries), grouped by a configurable content-type field. It talks to a Plone backend REST endpoint (`@bookmark` / `@bookmarks`) provided by the companion `collective.bookmarks` backend package.

This repo is a **Volto addon development shell**, not a standalone app: `core/` is a full checkout of the `plone/volto` monorepo (pinned in `mrs.developer.json`, tag defined there), pulled in on `make install` and git-ignored. The actual add-on source lives in `packages/volto-bookmarks`, plus a demo integration in `packages/policy`. Everything runs through Volto's addon/registry mechanism (`pnpm --filter @plone/volto ...` with `VOLTOCONFIG` pointing at `volto.config.js`).

## Common commands

Run from the repo root (not inside `packages/volto-bookmarks`):

```bash
make install       # mrs-developer fetch of core/ + pnpm i + build-deps
make start         # pnpm start (Volto dev server, add-on hot-reloads)
make build         # production bundle
make test          # unit tests (jest, via Volto's test runner)
make lint          # eslint (max-warnings=0) + prettier check + stylelint
make format        # prettier:fix + lint:fix + stylelint:fix
make i18n          # sync locale .po/.pot files for volto-bookmarks
make ci-i18n       # verify i18n is in sync (fails CI if not committed)
make storybook-start
make acceptance-backend-start   # docker-compose backend for Cypress
make acceptance-frontend-dev-start
make acceptance-test            # Cypress interactive
make ci-acceptance-test         # Cypress headless
```

Equivalent raw pnpm scripts (defined in root `package.json`) all wrap `pnpm --filter @plone/volto ...` with `VOLTOCONFIG=$(pwd)/volto.config.js`, e.g. `pnpm start`, `pnpm test`, `pnpm lint`.

Running a single unit test: there are currently no `*.spec.js`/`*.test.js` files in `packages/volto-bookmarks`; the jest config (`jest-addon.config.js`) matches any `spec|test` file under the workspace via Volto's own jest runner, so `--passWithNoTests` is set. If tests are added, target one file with `pnpm test -- path/to/file.test.js`.

Backend for manual testing: `make backend-docker-start` runs a dockerized Plone 6 backend with `collective.bookmarks` installed (souper must also be enabled in the Plone control panel — see README).

## Release / changelog process

This project uses **towncrier** news fragments, not hand-edited changelogs:

- Add one file per change under `packages/volto-bookmarks/news/`, named `<number>.<type>` (e.g. `18.bugfix`), where type is one of `breaking`, `feature`, `bugfix`, `internal`, `documentation`. Content is a one-line description.
- `release-it` (`.release-it.json`) runs towncrier to build `CHANGELOG.md` on release and syncs `package.json` version + root `README.md`/`CHANGELOG.md`.
- `make release` / `pnpm release` (or `dry-release`) drives this; don't hand-edit `CHANGELOG.md`.
- Pre-commit (`.pre-commit-config.yaml`) runs prettier, eslint, stylelint, and `make ci-i18n` on staged `packages/*/src` files.

## Architecture of `packages/volto-bookmarks/src`

- **`index.js`** — the add-on's `applyConfig`. Registers defaults for `config.settings.bookmarks` (`bookmarkgroupmapping`, `bookmarkgroupfield`, `filtermapping`), registers `BookmarksEditorComponent` as the toolbar menu body (`config.settings.additionalToolbarComponents.bookmarksMenu`), and mounts two headless components globally via `config.settings.appExtras`: `AppExtrasBookmarking` (fetches bookmarks on login/logout) and `EventListenerSearchkitSearch` (listens for searchkit query changes).
- **State**: uses **jotai atoms** (`atoms.js`), not Redux, for bookmark state — `fetchBookmarksAtom` is a read/write atom whose setter calls the `getBookmarks` action and caches `{ items, items_total }`; `null` value means "not logged in". `searchkitQueryAtom` mirrors the last `searchkitQueryChanged` browser event (dispatched by `react-searchkit`), used to detect that the current URL represents a search worth bookmarking.
- **`actions/index.js`** — thin wrappers around Volto's `Api` client hitting the backend `@bookmark`/`@bookmarks` REST endpoints. `_getApiPath()` picks `internalApiPath` vs `apiPath` for SSR vs client and appends `/++api++` unless `legacyTraverse` is set — mirrors Volto's own API-path logic and must stay in sync with it.
- **`helpers.js`** — `sortQuerystring` (canonicalizes a URL querystring so a search is bookmark-identity-stable regardless of param order), `parseSearchBlockQuery` (decodes the default Volto search block's JSON query param), `translateSearch` (maps facet/section values through `config.settings.bookmarks.filtermapping` for display).
- **Components**:
  - `Bookmarking.jsx` — Option 1 integration: plugs `ToggleBookmarkButton` into `main.toolbar.top` and renders `ShowBookmarksToolbarButton`. Consuming projects import this into their own `appExtras` (see root README).
  - `ToggleBookmarkButton.jsx` — the add/remove-bookmark button. Determines "am I bookmarked" by comparing the current content UID + sorted querystring against the fetched bookmarks list; determines the bookmark's `group` from `config.settings.bookmarks.bookmarkgroupfield` on the content object (falls back to `content.id` for search pages, `default_nogroup` otherwise). Works both for a page (`content` from Redux) and for an arbitrary `item` prop (used in listing variations).
  - `ShowBookmarksToolbarButton.jsx` / `ShowBookmarksContentButton.jsx` — two alternative entry points into the bookmarks list menu (toolbar plug vs. a standalone dropdown `Button`) — pick one per README's "Option 1 / Option 2".
  - `BookmarksEditorComponent.jsx` — renders the grouped bookmark list; groups via lodash `groupBy` on the `group` field, computes a human title per bookmark (`getTitle`) by parsing either the default search block's `query` JSON or a searchkit block's `q`/`f` params, and looks up group labels via `config.settings.bookmarks.bookmarkgroupmapping`.
  - `MenuItem.jsx` — a single bookmark row (link + delete button). Contains a documented workaround: re-selecting a different search bookmark needs a manual `popstate` event dispatch after `pushState`, since Volto's search doesn't otherwise notice the URL changed.
  - `AppExtrasBookmarking.jsx` / `EventListenerSearchkitSearch.jsx` — invisible, app-wide effect-only components (see index.js above).

## Configuration contract (what consuming Volto projects set)

Documented in root `README.md` — any change to defaults in `index.js` should stay consistent with it:

```js
config.settings.bookmarks = {
  bookmarkgroupmapping: { /* group-key -> label, "default_nogroup" is the catch-all */ },
  bookmarkgroupfield: 'type_title', // field on content read to compute the group
  filtermapping: {
    facet_fields: { /* facet value -> label */ },
    search_sections: { /* section value -> label */ },
  },
};
```

## `packages/policy`

A minimal demo/test add-on consuming `volto-bookmarks`: registers `Bookmarking`, extends the group mapping, and adds a listing block variation (`ListingVariationTemplateWithBookmarks`) that puts a per-item bookmark toggle on listing blocks. Useful as a worked example when adding new integration points.

## Notes

- `core/` is fetched by `mrs-developer` per `mrs.developer.json` and is git-ignored — never edit files under `core/`; treat it as a pinned, read-only dependency checkout.
- Path aliases (`@plone-collective/volto-bookmarks/...`, `@plone/volto/...`) are resolved through Volto's `AddonRegistry`, wired into eslint via the root `.eslintrc.js` — if imports resolve oddly, check that `core/` has been fetched (`make install`) rather than assuming a config bug.
- pnpm workspace (`pnpm-workspace.yaml`) includes both `core/packages/*` and `packages/*`; use `pnpm --filter <pkg>` to scope commands, matching what the `Makefile`/root `package.json` scripts already do.
