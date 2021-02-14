# volto-bookmarks


<img align="right" width="50" alt="volto-bookmarks" src="./src/icons/bookmark.svg" />

[Volto](https://github.com/plone/volto) add-on

## Features

Add and manage bookmarks: pages and pages with params like faceted navigation links to filtered content.

Bookmarks are grouped by the value of a selectable content type field.


## Getting started

> This add-on requires Volto 12 or higher version.

Provide the necessary REST API endpoints for your Plone backend by installing [collective.bookmarks](https://github.com/collective/collective.bookmarks.git) ( by now branch ksuess-2021)

Remember to install souper in control panel.


Include bookmarking of this package in your Volto projects config.js by

```js
import { ToggleBookmarkComponent, ShowBookmarksComponent } from '@collective/volto-bookmarks/components';

defaultToolbar.activities.view.top.push({
  match: {
    path: '/',
  },
  component: ToggleBookmarkComponent,
});

defaultToolbar.activities.view.bottom.push({
  match: {
    path: '/',
  },
  component: (props) => <ShowBookmarksMenu {...props} />,
});

export { defaultToolbar as toolbar };
```

It adds two buttons in toolbar: one for toggling the bookmark of the current page and one for displaying a menu with a list of bookmarks.

Add a mapping for bookmark groups labels and the name of the field for grouping bookmarks list.

````js
// @collective/volto-bookmarks
export const BOOKMARKGROUPMAPPING = {
  Anleitung: 'Anleitungen',
  Übersichtsseite: 'Übersichtsseiten',
  ReleaseNote: 'Release Notes',
  default_search: 'Search',
  default_nogroup: 'Miscellaneous',
};

export const BOOKMARKGROUPFIELD = 'informationtype';
````

## Copyright and license

Author Katja Süss, Rohberg, 
https://www.rohberg.ch

Copyright (c) 2021 Plone Foundation

See [LICENSE.md](https://github.com/collective/volto-bookmarks/blob/master/LICENSE.md) for details.
