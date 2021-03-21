# volto-bookmarks

<img align="right" width="50" alt="volto-bookmarks" src="./src/icons/bookmark.svg" />


[Plone (Volto)](https://github.com/plone/volto) add-on

## Features

Add and manage bookmarks for pages and search results.

Bookmarks are grouped by the value of a selectable content type field.


<img align="right" width="400px" alt="volto-bookmarks" src="./src/readmeillustration/bookmarks_somewhereelse.png" />

## Getting started

There are two options:

- Buttons in toolbar
- Buttons somewhere else

> This add-on requires Volto 12.

> And this add-on requires upcoming Volto 12.xy or higher version with a pluggable toolbar if you want to place the buttons in toolbar.

## Installation

Provide the necessary REST API endpoints for your Plone backend by installing [collective.bookmarks](https://github.com/collective/collective.bookmarks.git) 

Remember to install souper in Plone backend control panel.

Usual installation of a Plone (Volto) add-on:

```bash
yarn add @collective/volto-bookmarks
```

*src/package.json*

```json
  "addons": [
    "@collective/volto-bookmarks"
  ],

  "dependencies": {
    "@collective/volto-bookmarks": "^1.0.0"
  },
```

Install new add-on and get translations of add-ons:

```bash
yarn
yarn i18n
```

## Integration of the two bookmark buttons

### Option 1 - buttons in toolbar

> This requires **upcoming** Volto 12.xy or higher version with a pluggable toolbar.

Include bookmarking of this package in your Volto projects config.js by

```js
import { ToggleBookmarkButton, ShowBookmarksToolbarButton } from '@collective/volto-bookmarks/components';

export default function applyConfig(config) {
  config.toolbar.activities.view.top.push({
    match: {
      path: '/pathtosectionofbookmarkablepages/',
    },
    component: ToggleBookmarkButton,
  });
  config.toolbar.activities.view.bottom.push({
    match: {
      path: '/',
    },
    component: (props) => <ShowBookmarksToolbarButton {...props} />,
  });

  return config;
}
```

It adds two buttons in toolbar: one for toggling the bookmark of the current page and one for displaying a menu with a list of bookmarks.

### Option 2 - buttons not in toolbar but sowhere else

Add the both buttons to components of your choice:

```jsx
import { ShowBookmarksContentButton } from '@collective/volto-bookmarks/components';

    <ShowBookmarksContentButton token={hereisatoken.token} />

```

```jsx
import { ToggleBookmarkButton } from '@collective/volto-bookmarks/components';

    <ToggleBookmarkButton token={hereisatoken.token} />

```

*hereisatoken.token*: *this.props.token* for class components or just *token* for funky components.

### Further configuration for both options

Add a mapping for bookmark groups labels and the name of the field for grouping bookmarks list.

```js
// @collective/volto-bookmarks
export const BOOKMARKGROUPMAPPING = {
  Anleitung: 'Anleitungen',
  Übersichtsseite: 'Übersichtsseiten',
  ReleaseNote: 'Release Notes',
  default_search: 'Search',
  default_nogroup: 'Miscellaneous',
};

export const BOOKMARKGROUPFIELD = 'informationtype';
```

Start Volto:

```bash
yarn start
```

**You are ready to collect bookmarks!** 
<img align="right" width="50" alt="volto-bookmarks" src="./src/icons/bookmark.svg" />



## Copyright and License

Author @ksuess, Katja Süss, Rohberg, 
https://www.rohberg.ch

Copyright (c) 2021 Plone Foundation

See [LICENSE.md](https://github.com/collective/volto-bookmarks/blob/master/LICENSE.md) for details.
