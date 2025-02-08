// https://github.com/ipenywis/redux-alternatives/blob/main/src/libraries/jotai.tsx#L27
import { atom } from 'jotai';
import { getBookmarks } from './actions';

const INITIAL_BOOKMARKS = { items_total: 0, items: [] };

const bookmarksAtom = atom(INITIAL_BOOKMARKS);
export const searchkitQueryAtom = atom(0);

export const fetchBookmarksAtom = atom(
  (get) => get(bookmarksAtom),
  async (get, set) => {
    const result = await getBookmarks();
    set(bookmarksAtom, {
      items: result || [],
      items_total: (result || []).length,
    });
  },
);
