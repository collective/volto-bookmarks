import {
  GET_BOOKMARK,
  ADD_BOOKMARK,
  PUT_BOOKMARK,
  DEL_BOOKMARK,
  GET_BOOKMARKS,
} from '../constants';

import { doStringifySearchquery } from '../helpers';

export function getBookmark(uid, group, searchquery = '') {
  // TODO consequent use of document.location.search or remove completly.
  const url = new URL(document.location);
  searchquery = url.search;
  return {
    type: GET_BOOKMARK,
    request: {
      op: 'get',
      path: `/@bookmark?uid=${uid}&group=${group}&queryparams=${doStringifySearchquery(
        searchquery,
      )}`,
    },
  };
}

export function addBookmark(uid, group, searchquery = '', payload = {}) {
  const url = new URL(document.location);
  searchquery = url.search;
  return {
    type: ADD_BOOKMARK,
    request: {
      op: 'post',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: doStringifySearchquery(searchquery),
        payload,
      },
    },
  };
}

export function modifyBookmark(uid, group, searchquery = '', payload = {}) {
  const url = new URL(document.location);
  searchquery = url.search;
  return {
    type: PUT_BOOKMARK,
    request: {
      op: 'put',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: doStringifySearchquery(searchquery),
        payload,
      },
    },
  };
}

export function deleteBookmark(uid, group, searchquery = '') {
  // const url = new URL(document.location);
  // searchquery = url.search;
  return {
    type: DEL_BOOKMARK,
    request: {
      op: 'del',
      path: `/@bookmark`,
      data: {
        uid,
        group,
        queryparams: doStringifySearchquery(searchquery),
      },
    },
  };
}

export function getBookmarks(group) {
  // Get list of bookmarks.
  return {
    type: GET_BOOKMARKS,
    request: {
      op: 'get',
      path: `/@bookmarks` + (group ? `?group=${group}` : ``),
    },
  };
}
