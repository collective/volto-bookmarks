/**
 * Bookmark actions
 */

import { ADD_BOOKMARK, DEL_BOOKMARK, GET_BOOKMARKS } from '../constants';

import { sortQuerystring } from '../helpers';

/**
 * addBookmark
 * @param {String} uid
 * @param {String} group
 * @param {String} querystring
 * @param {Object} payload
 */
export function addBookmark(uid, group, querystring = null, payload = {}) {
  return {
    type: ADD_BOOKMARK,
    request: {
      op: 'post',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: sortQuerystring(querystring),
        payload,
      },
    },
  };
}

/**
 * deleteBookmark
 * @param {String} uid
 * @param {String} group
 * @param {Object} queryObjectStringified
 */
export function deleteBookmark(uid, group, querystring = null) {
  return {
    type: DEL_BOOKMARK,
    request: {
      op: 'del',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: sortQuerystring(querystring),
      },
    },
  };
}

/**
 * Get list of bookmarks
 * @param {string} group
 */
export function getAllBookmarks(group) {
  return {
    type: GET_BOOKMARKS,
    request: {
      op: 'get',
      path: `/@bookmarks` + (group ? `?group=${group}` : ``),
    },
  };
}
