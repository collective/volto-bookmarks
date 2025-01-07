/**
 * Bookmark actions
 */

import { ADD_BOOKMARK, DEL_BOOKMARK, GET_BOOKMARKS } from '../constants';

import { generateSearchQueryObject } from '../helpers';

export function addBookmark(uid, group, querystring = '', payload = {}) {
  return {
    type: ADD_BOOKMARK,
    request: {
      op: 'post',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: JSON.stringify(generateSearchQueryObject(querystring)),
        payload,
      },
    },
  };
}

export function deleteBookmark(uid, group, querystring = '') {
  return {
    type: DEL_BOOKMARK,
    request: {
      op: 'del',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: querystring,
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
