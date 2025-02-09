import BookmarksEditorComponent from '@plone-collective/volto-bookmarks/components/BookmarksEditorComponent';
import AppExtrasBookmarking from '@plone-collective/volto-bookmarks/components/AppExtrasBookmarking';
import EventListenerSearchkitSearch from '@plone-collective/volto-bookmarks/components/EventListenerSearchkitSearch';

const applyConfig = (config) => {
  // button and menu are added in Volto project. See README.txt

  // defaults
  config.settings.bookmarks = {
    ...(config.settings.bookmarks ?? {}),
    bookmarkgroupmapping: {
      search: 'Search results', // id of search page
      'search-in-news': 'Search in News', // id of another search page
      default_nogroup: 'Miscellaneous',
    },
    bookmarkgroupfield: 'type_title',
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
      component: EventListenerSearchkitSearch,
    },
  ];

  return config;
};

export default applyConfig;
