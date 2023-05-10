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

export function addBookmark(
  uid,
  group,
  querystring = '',
  payload = {},
  owner = null,
) {
  let data = {
    uid,
    group,
    queryparams: doStringifySearchquery(querystring),
    payload,
  };
  if (owner) {
    data['owner'] = owner;
  }
  return {
    type: ADD_BOOKMARK,
    request: {
      op: 'post',
      path: `/@bookmark`,
      data: data,
    },
  };
}

export function modifyBookmark(
  uid,
  group,
  querystring = '',
  payload = {},
  owner = null,
) {
  let data = {
    uid,
    group,
    queryparams: doStringifySearchquery(querystring),
    payload,
  };
  if (owner) {
    data['owner'] = owner;
  }
  return {
    type: PUT_BOOKMARK,
    request: {
      op: 'put',
      path: `/@bookmark`,
      data: data,
    },
  };
}

export function deleteBookmark(uid, group, querystring = '', owner = null) {
  let data = {
    uid,
    group,
    queryparams: querystring,
  };
  if (owner) {
    data['owner'] = owner;
  }
  return {
    type: DEL_BOOKMARK,
    request: {
      op: 'del',
      path: `/@bookmark`,
      data: data,
    },
  };
}

/**
 * Get list of bookmarks
 * @param {string} group
 */
export function getAllBookmarks(group = null, allusers = null) {
  let path = '/@bookmarks';
  var searchParams = new URLSearchParams();
  group && searchParams.append('group', group);
  allusers && searchParams.append('allusers', '1');
  const searchParamsToString = searchParams.toString();
  if (searchParamsToString) {
    path += `?${searchParamsToString}`;
  }

  return {
    type: GET_BOOKMARKS,
    request: {
      op: 'get',
      path: path,
    },
  };
}
