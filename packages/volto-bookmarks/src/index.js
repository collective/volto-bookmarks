import BookmarksEditorComponent from '@plone-collective/volto-bookmarks/components/BookmarksEditorComponent';
import { collectivebookmarks } from '@plone-collective/volto-bookmarks/reducers';
import EventListenerSearchkitSearch from '@plone-collective/volto-bookmarks/components/EventListenerSearchkitSearch';
import AppExtrasBookmarking from '@plone-collective/volto-bookmarks/components/AppExtrasBookmarking';
import AppExtrasJotaiBookmarking from '@plone-collective/volto-bookmarks/components/AppExtrasJotaiBookmarking';

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

  config.settings.bookmarks.filtermapping = {
    facet_fields: {
      'News Item': 'News Item',
      Document: 'Page',
      Event: 'Event',
    },
    search_sections: {
      others: 'Website',
      news: 'News',
    },
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
      component: AppExtrasJotaiBookmarking,
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
