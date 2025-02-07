import React from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { useAtom } from 'jotai';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import bookmarkSVG from '@plone-collective/volto-bookmarks/icons/bookmark.svg';
import bookmarkSelectedSVG from '@plone-collective/volto-bookmarks/icons/bookmark_selected.svg';

import {
  addBookmark,
  deleteBookmark,
} from '@plone-collective/volto-bookmarks/actions';

import {
  fetchBookmarksAtom,
  searchkitQueryAtom,
} from '@plone-collective/volto-bookmarks/atoms';
import { sortQuerystring } from '@plone-collective/volto-bookmarks/helpers';

import config from '@plone/volto/registry';

const messages = defineMessages({
  label_addbookmark: {
    id: 'label_addbookmark',
    defaultMessage: 'add or delete bookmark',
  },
});

/**
 * Add a bookmark to users bookmark list
 */
const ToggleBookmarkButton = ({ item = null }) => {
  const [searchkitQuery] = useAtom(searchkitQueryAtom);
  const content = useSelector((state) => state.content?.data);

  const [bookmarks, fetchBookmarks] = useAtom(fetchBookmarksAtom);

  const querystringResults = useSelector(
    (state) => state.querystringsearch?.subrequests,
  );
  const routerLocationSearch = useSelector(
    (state) => state.router?.location?.search,
  );
  const intl = useIntl();

  const [group, setGroup] = React.useState('default_nogroup');
  const [bookmarked, setBookmarked] = React.useState(false);

  React.useEffect(() => {
    // Check if page is bookmarked
    setBookmarked(false);
    const doLoSearch = sortQuerystring(document.location.search);
    bookmarks.items?.forEach((element) => {
      if (
        item
          ? element.uid === item?.UID
          : element.uid === content?.UID && element.queryparams === doLoSearch
      ) {
        setBookmarked(true);
      }
    });

    // group
    if (document.location.search && !item) {
      setGroup(content.id);
    } else {
      let grp_token = get(
        item || content,
        config.settings?.bookmarks?.bookmarkgroupfield,
        'default_nogroup',
      );
      setGroup(
        grp_token && grp_token.length > 0
          ? grp_token[0].token || grp_token
          : 'default_nogroup',
      );
    }
  }, [
    content,
    item,
    bookmarks,
    querystringResults,
    routerLocationSearch,
    searchkitQuery,
  ]);

  async function toggleBookmarkHandler() {
    if (bookmarked) {
      const response = await deleteBookmark(
        item?.UID || content.UID,
        group,
        item?.UID ? null : document.location.search,
      );
      if (response.ok) {
        setBookmarked(false);
        fetchBookmarks();
      }
    } else {
      const response = await addBookmark(
        item?.UID || content.UID,
        group,
        item?.UID ? null : document.location.search,
        {},
      );
      if (response.ok) {
        setBookmarked(true);
        fetchBookmarks();
      }
    }
  }

  return bookmarks && (item || content['@type'] !== 'Plone Site') ? (
    <Button
      icon
      basic
      id="toolbar-addbookmark"
      className="addbookmark"
      aria-label={intl.formatMessage(messages.label_addbookmark)}
      onClick={() => toggleBookmarkHandler()}
    >
      <span>{group}</span>
      <Icon
        name={bookmarked ? bookmarkSelectedSVG : bookmarkSVG}
        size="30px"
        title={intl.formatMessage(messages.label_addbookmark)}
        className={bookmarked ? 'selected' : 'unselected'}
      />
    </Button>
  ) : null;
};

export default injectIntl(ToggleBookmarkButton);
