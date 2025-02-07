// https://github.com/ipenywis/redux-alternatives/blob/main/src/libraries/jotai.tsx#L27
import { atom } from 'jotai';
import { getBookmarks } from './actions';

const INITIAL_BOOKMARKS = { items_total: 0, items: [] };

const bookmarksAtom = atom(INITIAL_BOOKMARKS);
export const searchkitQueryAtom = atom(0);

export const fetchBookmarksAtom = atom(
  (get) => get(bookmarksAtom),
  async (get, set) => {
    const response = await getBookmarks();
    if (response.ok) {
      console.debug('Set bookmarks atom');
      const fetchedBookmarks = await response.json();
      set(bookmarksAtom, {
        items: fetchedBookmarks || [],
        items_total: (fetchedBookmarks || []).length,
      });
    } else {
      console.debug('Reset bookmarks atom');
      set(bookmarksAtom, INITIAL_BOOKMARKS);
    }
  },
);
