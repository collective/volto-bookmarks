import { collectivebookmarks } from './reducers';

const applyConfig = (config) => {
  // button and menu are added in Volto project. See README.txt

  config.settings.bookmarks = {
    ...(config.settings.bookmarks ?? {}),
    bookmarkgroupmapping: {
      default_search: 'Search results',
      default_nogroup: 'Miscellaneous',
    },
    bookmarkgroupfield: '@type',
  };

  // reducers
  config.addonReducers = {
    ...config.addonReducers,
    collectivebookmarks,
  };
  return config;
};

export default applyConfig;
