import { Plug } from '@plone/volto/components/manage/Pluggable';
import ShowBookmarksToolbarButton from '@plone-collective/volto-bookmarks/components/ShowBookmarksToolbarButton';
import ToggleBookmarkButton from '@plone-collective/volto-bookmarks/components/ToggleBookmarkButton';

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
