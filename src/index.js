// import { DatabaseInformation } from '@plone/volto/components';
import { BookmarksEditorComponent } from './components';
import { collectivebookmarks } from './reducers';

const applyConfig = (config) => {
  // routes
  config.addonRoutes.push({
    path: '/collectivebookmarks',
    component: BookmarksEditorComponent,
  });
  config.settings.nonContentRoutes.push('/collectivebookmarks');

  // button and menu are added in Volto project. See README.txt

  // reducers
  config.addonReducers = {
    ...config.addonReducers,
    collectivebookmarks,
  };
  return config;
};

export default applyConfig;

// nonContentRoutes.push('/collectivebookmarks')
