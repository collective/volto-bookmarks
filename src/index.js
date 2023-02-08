import BookmarksEditorComponent from './components/BookmarksEditorComponent';
import { collectivebookmarks } from './reducers';

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

  // reducers
  config.addonReducers = {
    ...config.addonReducers,
    collectivebookmarks,
  };
  return config;
};

export default applyConfig;
