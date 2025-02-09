/**
 * Bookmark actions
 */
import Api from '@plone/volto/helpers/Api/Api';
import { sortQuerystring } from '../helpers';

import config from '@plone/volto/registry';

function _getApiPath() {
  const { settings } = config;
  const apiSuffix = settings.legacyTraverse ? '' : '/++api++';
  const apiPath = settings.internalApiPath ?? settings.apiPath;

  const apiPathWithSuffix = `${apiPath}${apiSuffix}`;
  return apiPathWithSuffix;
}

/**
 * addBookmark
 * @param {String} uid
 * @param {String} group
 * @param {String} querystring
 * @param {Object} payload
 */
export async function addBookmark(
  uid,
  group,
  querystring = null,
  payload = {},
) {
  const api = new Api();
  const path = `${_getApiPath()}/@bookmark`;
  const result = await api['post'](path, {
    data: {
      uid,
      group,
      queryparams: sortQuerystring(querystring),
      payload,
    },
  });
  return result;
}

/**
 * deleteBookmark
 * @param {String} uid
 * @param {String} group
 * @param {Object} queryObjectStringified
 */
export async function deleteBookmark(uid, group, querystring = null) {
  const api = new Api();
  const path = `${_getApiPath()}/@bookmark`;
  const result = await api['del'](path, {
    data: {
      uid,
      group,
      queryparams: sortQuerystring(querystring),
    },
  });
  return result;
}

/**
 * getBookmarks
 * Get list of bookmarks
 * @param {string} group
 */
export async function getBookmarks(group) {
  const api = new Api();
  const path = `${_getApiPath()}/@bookmarks` + (group ? `?group=${group}` : ``);
  const result = await api['get'](path);
  return result;
}
