# Changelog

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/volto/developer-guidelines/contributing.html#create-a-pull-request
-->

<!-- towncrier release notes start -->

## 3.1.0 (2026-11-24)

### Bugfix

- Show correct search URL and title for old bookmarks whose queryparams were stored as JSON. @ksuess [#19](https://github.com/collective/volto-bookmarks/issue/19)

### Internal

- Align release setup with Volto core: release-it 21, publish via `@plone/scripts` prepublish plugin, use `uvx towncrier`. @ksuess [#21](https://github.com/collective/volto-bookmarks/issue/21)
- Update to Volto 19 (core 19.8.2, pnpm 10, Node 24, vitest instead of jest). @ksuess [#22](https://github.com/collective/volto-bookmarks/issue/22)

## 3.0.4 (2026-07-05)

### Bugfix

- Refactor _getApiPath to improve clarity on apiPath assignment. @ksuess [#18](https://github.com/collective/volto-bookmarks/issue/18)

## 3.0.3 (2026-07-04)

### Bugfix

- Fix null-safety. @ksuess [#16](https://github.com/collective/volto-bookmarks/issue/16)

## 3.0.2 (2025-03-18)

## 3.0.1 (2025-03-18)

### Internal

- Clean up. Moving listing template with bookmarks to policy/testing package. @ksuess [#15](https://github.com/collective/volto-bookmarks/issue/15)

## 3.0.0 (2025-02-10)

### Feature

- Enhance bookmarking of search requests: bookmarks menu: labels according search parameters. @ksuess [#7](https://github.com/collective/volto-bookmarks/issue/7)
- Refactor ToggleBookmarkButton to work without access to Redux store. Use Jotai atom. @ksuess [#9](https://github.com/collective/volto-bookmarks/issue/9)
- Bookmarking in listing and search block. @ksuess [#14](https://github.com/collective/volto-bookmarks/issue/14)

## 2.0.0 (2025-01-09)

### Feature

- Bookmarking also via listing block and search block. @ksuess [#7](https://github.com/collective/volto-bookmarks/issue/7)

### Internal

- Add acceptance tests for bookmarking a page and bookmarking via listing block and search block. @ksuess [#8](https://github.com/collective/volto-bookmarks/issue/8)
