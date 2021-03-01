/**
 * Faq reducer.
 * @module reducers/faq/faq
 */

import {
  GET_BOOKMARK,
  ADD_BOOKMARK,
  PUT_BOOKMARK,
  DEL_BOOKMARK,
  GET_BOOKMARKS,
} from '../constants';

const initialState = {
  error: null,
  items: [],
  bookmark: null,
  loaded: false,
  loading: false,
};

export function collectivebookmarks(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_BOOKMARK}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${GET_BOOKMARK}_SUCCESS`:
      return {
        ...state,
        error: null,
        bookmark: action.result,
        loaded: true,
        loading: false,
      };
    case `${GET_BOOKMARK}_FAIL`:
      // reset current bookmark
      return {
        ...state,
        error: action.error,
        bookmark: null,
        loading: false,
        loaded: false,
      };

    case `${ADD_BOOKMARK}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${ADD_BOOKMARK}_SUCCESS`:
      return {
        ...state,
        error: null,
        items: [...state.items, action.result],
        bookmark: action.result,
        loaded: true,
        loading: false,
      };
    case `${ADD_BOOKMARK}_FAIL`:
      return {
        ...state,
        error: action.error,
        bookmark: null,
        loading: false,
        loaded: false,
      };

    case `${PUT_BOOKMARK}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${PUT_BOOKMARK}_SUCCESS`:
      return {
        ...state,
        error: null,
        bookmark: action.result,
        loaded: true,
        loading: false,
      };
    case `${PUT_BOOKMARK}_FAIL`:
      return {
        ...state,
        error: action.error,
        loading: false,
        loaded: false,
      };

    case `${DEL_BOOKMARK}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${DEL_BOOKMARK}_SUCCESS`:
      return {
        ...state,
        error: null,
        bookmark: null,
        loaded: true,
        loading: false,
      };
    case `${DEL_BOOKMARK}_FAIL`:
      return {
        ...state,
        error: action.error,
        loading: false,
        loaded: false,
      };

    // list of bookmarks
    case `${GET_BOOKMARKS}_PENDING`:
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    case `${GET_BOOKMARKS}_SUCCESS`:
      return {
        ...state,
        error: null,
        items: action.result,
        loaded: true,
        loading: false,
      };
    case `${GET_BOOKMARKS}_FAIL`:
      return {
        ...state,
        error: action.error,
        loading: false,
        loaded: false,
      };

    default:
      return state;
  }
}
