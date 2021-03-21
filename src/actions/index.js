/**
 * Bookmark actions
 */

import {
  GET_BOOKMARK,
  ADD_BOOKMARK,
  PUT_BOOKMARK,
  DEL_BOOKMARK,
  GET_BOOKMARKS,
} from '../constants';

import { doStringifySearchquery } from '../helpers';

export function getBookmark(uid, group, querystring = '') {
  return {
    type: GET_BOOKMARK,
    request: {
      op: 'get',
      path: `/@bookmark?uid=${uid}&group=${group}&queryparams=${doStringifySearchquery(
        querystring,
      )}`,
    },
  };
}

export function addBookmark(uid, group, querystring = '', payload = {}) {
  return {
    type: ADD_BOOKMARK,
    request: {
      op: 'post',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: doStringifySearchquery(querystring),
        payload,
      },
    },
  };
}

export function modifyBookmark(uid, group, querystring = '', payload = {}) {
  return {
    type: PUT_BOOKMARK,
    request: {
      op: 'put',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: doStringifySearchquery(querystring),
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
        queryparams: doStringifySearchquery(querystring),
      },
    },
  };
}

/**
 * Get list of bookmarks
 * @param {string} group
 */
export function getBookmarks(group) {
  return {
    type: GET_BOOKMARKS,
    request: {
      op: 'get',
      path: `/@bookmarks` + (group ? `?group=${group}` : ``),
    },
  };
}
