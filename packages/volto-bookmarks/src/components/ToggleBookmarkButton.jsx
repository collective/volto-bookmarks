import React from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
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

import { generateSearchQueryObject } from '@plone-collective/volto-bookmarks/helpers';

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
  const token = useSelector((state) => state.userSession?.token);
  const content = useSelector((state) => state.content?.data);
  const bookmarksArray = useSelector(
    (state) => state.collectivebookmarks?.items,
  );
  const querystringResults = useSelector(
    (state) => state.querystringsearch.subrequests,
  );
  const routerLocationSearch = useSelector(
    (state) => state.router.location.search,
  );
  const intl = useIntl();
  const dispatch = useDispatch();

  const [group, setGroup] = React.useState('default_nogroup');
  const [bookmarked, setBookmarked] = React.useState(false);

  React.useEffect(() => {
    // Check if page is bookmarked
    setBookmarked(false);
    const doLoSearch = generateSearchQueryObject(document.location.search);
    bookmarksArray.forEach((element) => {
      if (
        item
          ? element.uid === item?.UID
          : element.uid === content?.UID &&
            isEqual(JSON.parse(element.queryparams), doLoSearch)
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
          JSON.stringify(
            generateSearchQueryObject(
              item?.UID ? '' : document.location.search,
            ),
          ),
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
          item?.UID ? '' : document.location.search,
          {},
        ),
      ).then(() => {
        dispatch(getAllBookmarks());
      });
    }
  }

  return token && (item || content['@type'] !== 'Plone Site') ? (
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
