// https://github.com/ipenywis/redux-alternatives/blob/main/src/libraries/jotai.tsx#L27
import { atom } from 'jotai';
import { getBookmarks } from './actions';

const bookmarksAtom = atom(null);

export const fetchBookmarksAtom = atom(
  (get) => get(bookmarksAtom),
  async (get, set, value) => {
    if (value === null) {
      set(bookmarksAtom, null);
    } else {
      const result = await getBookmarks(value);
      set(bookmarksAtom, {
        items: result || [],
        items_total: (result || []).length,
      });
    }
  },
);

export const searchkitQueryAtom = atom(null);
