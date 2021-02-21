// import { DatabaseInformation } from '@plone/volto/components';
import { BookmarksEditorComponent } from './components';
import { collectivebookmarks } from './reducers';

const applyConfig = (config) => {
  // button and menu are added in Volto project. See README.txt

  // reducers
  config.addonReducers = {
    ...config.addonReducers,
    collectivebookmarks,
  };
  return config;
};

export default applyConfig;
