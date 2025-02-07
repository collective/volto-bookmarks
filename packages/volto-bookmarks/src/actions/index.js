/**
 * Bookmark actions
 */

import { sortQuerystring } from '../helpers';

import config from '@plone/volto/registry';

function getApiPath() {
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
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const response = await fetch(`${getApiPath()}/@bookmark`, {
    method: 'POST',
    body: JSON.stringify({
      uid,
      group,
      queryparams: sortQuerystring(querystring),
      payload,
    }),
    headers: myHeaders,
  });
  return response;
}

/**
 * deleteBookmark
 * @param {String} uid
 * @param {String} group
 * @param {Object} queryObjectStringified
 */
export async function deleteBookmark(uid, group, querystring = null) {
  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/json');

  const response = await fetch(`${getApiPath()}/@bookmark`, {
    method: 'DELETE',
    body: JSON.stringify({
      uid,
      group,
      queryparams: sortQuerystring(querystring),
    }),
    headers: myHeaders,
  });
  return response;
}

/**
 * Get list of bookmarks
 * @param {string} group
 */
export async function getBookmarks(group) {
  const response = await fetch(
    `${getApiPath()}/@bookmarks` + (group ? `?group=${group}` : ``),
  );
  return response;
}
