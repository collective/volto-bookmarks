import BookmarksEditorComponent from '@plone-collective/volto-bookmarks/components/BookmarksEditorComponent';
import { collectivebookmarks } from '@plone-collective/volto-bookmarks/reducers';
import EventListenerSearchkitSearch from '@plone-collective/volto-bookmarks/components/EventListenerSearchkitSearch';
import AppExtrasBookmarking from '@plone-collective/volto-bookmarks/components/AppExtrasBookmarking';

const applyConfig = (config) => {
  // button and menu are added in Volto project. See README.txt

  // defaults
  config.settings.bookmarks = {
    ...(config.settings.bookmarks ?? {}),
    bookmarkgroupmapping: {
      default_search: 'Search results',
      default_nogroup: 'Miscellaneous',
    },
    bookmarkgroupfield: '@type',
  };

  // menu body
  config.settings.additionalToolbarComponents = {
    bookmarksMenu: {
      component: BookmarksEditorComponent,
      wrapper: null,
    },
  };

  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: AppExtrasBookmarking,
    },
    {
      match: '/',
      component: EventListenerSearchkitSearch,
    },
  ];

  // reducers
  config.addonReducers = {
    ...config.addonReducers,
    collectivebookmarks,
  };
  return config;
};

export default applyConfig;
