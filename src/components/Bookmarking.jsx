import { Plug } from '@plone/volto/components/manage/Pluggable';
import {
  ToggleBookmarkButton,
  ShowBookmarksToolbarButton,
} from '@plone-collective/volto-bookmarks/components';

const Bookmarking = () => {
  return (
    <>
      <Plug pluggable="main.toolbar.top" id="toggle-bookmarks">
        <ToggleBookmarkButton />
      </Plug>
      <ShowBookmarksToolbarButton />
    </>
  );
};
export default Bookmarking;
