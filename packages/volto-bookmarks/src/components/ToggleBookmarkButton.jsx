import React from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { useAtomValue } from 'jotai';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import bookmarkSVG from '@plone-collective/volto-bookmarks/icons/bookmark.svg';
import bookmarkSelectedSVG from '@plone-collective/volto-bookmarks/icons/bookmark_selected.svg';

import {
  addBookmark,
  deleteBookmark,
  getAllBookmarks,
} from '@plone-collective/volto-bookmarks/actions';

import { sortQuerystring } from '@plone-collective/volto-bookmarks/helpers';

import { allBookmarksAtom } from '@plone-collective/volto-bookmarks/atoms';

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
  const content = useSelector((state) => state.content?.data);

  const bookmarksArray = useAtomValue(allBookmarksAtom)?.items;

  const querystringResults = useSelector(
    (state) => state.querystringsearch?.subrequests,
  );
  const routerLocationSearch = useSelector(
    (state) => state.router?.location?.search,
  );
  const intl = useIntl();
  const dispatch = useDispatch();

  const [group, setGroup] = React.useState('default_nogroup');
  const [bookmarked, setBookmarked] = React.useState(false);

  React.useEffect(() => {
    // Check if page is bookmarked
    setBookmarked(false);
    const doLoSearch = sortQuerystring(document.location.search);
    bookmarksArray &&
      bookmarksArray.forEach((element) => {
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
      setGroup('default_search');
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
  }, [content, item, bookmarksArray, querystringResults, routerLocationSearch]);

  function toggleBookmarkHandler() {
    if (bookmarked) {
      setBookmarked(false);
      dispatch(
        deleteBookmark(
          item?.UID || content.UID,
          group,
          item?.UID ? null : document.location.search,
        ),
      ).then(() => {
        dispatch(getAllBookmarks());
      });
    } else {
      setBookmarked(true);
      dispatch(
        addBookmark(
          item?.UID || content.UID,
          group,
          item?.UID ? null : document.location.search,
          {},
        ),
      ).then(() => {
        dispatch(getAllBookmarks());
      });
    }
  }

  return bookmarksArray && (item || content['@type'] !== 'Plone Site') ? (
    <Button
      icon
      basic
      id="toolbar-addbookmark"
      className="addbookmark"
      aria-label={intl.formatMessage(messages.label_addbookmark)}
      onClick={() => toggleBookmarkHandler()}
    >
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
