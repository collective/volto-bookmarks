# volto-bookmarks

<img align="right" width="50" alt="volto-bookmarks" src="./src/icons/bookmark.svg" />


[Plone (Volto)](https://github.com/plone/volto) add-on

## Features

Add and manage bookmarks of pages and searchkit queries.

Bookmarks are grouped by the value of a selectable content type field.


<img align="right" width="400px" alt="volto-bookmarks" src="./src/readmeillustration/bookmarks_somewhereelse.png" />

## Getting started

There are two options:

- Buttons in toolbar
- Buttons somewhere else

## Installation

- Provide the necessary REST API endpoints for your Plone backend by installing [collective.bookmarks](https://github.com/collective/collective.bookmarks.git) 

- Remember to install souper in Plone backend control panel.

- Install this Plone (Volto) add-on. See [Volto docs](https://6.docs.plone.org/volto/addons/index.html#configuring-a-volto-project-to-use-an-add-on) for instructions.

- Merge add-on translations into your Volto app. Available translations so far: German.

```bash
yarn
yarn i18n
```


## Integration of the two bookmark buttons

### Option 1 - buttons in toolbar

> This requires **upcoming** Volto version with a pluggable toolbar.

Include bookmarking in your Volto project by creating and integrating a component `Bookmarking`.

`Bookmarking.jsx`:

```jsx
import { Plug } from '@plone/volto/components/manage/Pluggable';
import {
  ToggleBookmarkButton,
  ShowBookmarksToolbarButton,
} from '@collective/volto-bookmarks/components';
const Bookmarks = () => {
  return (
    <>
      <Plug pluggable="main.toolbar.top" id="toggle-bookmarks">
        <ToggleBookmarkButton />
      </Plug>
      <ShowBookmarksToolbarButton />
    </>
  );
};
export default Bookmarks;
```

`config.js`:

```js
import Bookmarking from './components/Bookmarking';

export default function applyConfig(config) {
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: Bookmarking,
    },
  ];
  return config;
}
```

This adds two buttons in toolbar: one for toggling the bookmark of the current page and one for displaying a menu with a list of bookmarks.


### Option 2 - buttons not in toolbar but sowhere else

Add the two buttons to components of your choice:

```jsx
import { ShowBookmarksContentButton } from '@collective/volto-bookmarks/components';

    <ShowBookmarksContentButton />

```

```jsx
import { ToggleBookmarkButton } from '@collective/volto-bookmarks/components';

    <ToggleBookmarkButton />

```


### Further configuration for both options

Add a mapping for bookmark groups labels and the name of the field for grouping bookmarks list.

```js
config.settings.bookmarks = {
  ...(config.settings.bookmarks),
  bookmarkgroupmapping: {
    manual: 'Manuals and HowTos',
    releasenote: 'Release Notes',
    default_search: 'Search',
    default_nogroup: 'Miscellaneous',
  },
  bookmarkgroupfield: 'informationtype',
};
```


<img align="right" width="50" alt="volto-bookmarks" src="./src/icons/bookmark.svg" />


## Copyright and License

Author Katja Süss, Rohberg, @ksuess
https://www.rohberg.ch

Copyright (c) 2023 Plone Foundation

See [LICENSE.md](https://github.com/collective/volto-bookmarks/blob/master/LICENSE.md) for details.
