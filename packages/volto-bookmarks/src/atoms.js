import { atom } from 'jotai';

// Jotai store for bookmarks of the current user
export const allBookmarksAtom = atom({ items_total: 0, items: [] });
