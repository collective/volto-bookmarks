import React, { useState } from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

// import bookmarkSVG from '@plone/volto/icons/bookmark.svg';
import bookmarkSVG from '../icons/bookmark.svg';
import bookmarkFilledSVG from '../icons/bookmark_filled.svg';

import { getBookmark, addBookmark, deleteBookmark } from '../actions';

import { doStringifySearchquery } from '../helpers';

import config from '@plone/volto/registry';

const messages = defineMessages({
  label_addbookmark: {
    id: 'label_addbookmark',
    defaultMessage: 'add or delete bookmark',
  },
});

/**
 * Add a bookmark to owners bookmark list
 */
const ToggleBookmarkButton = () => {
  const content = useSelector((state) => state.content.data);
  const token = useSelector((state) => state.userSession?.token);
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentbookmark = useSelector(
    (state) => state.collectivebookmarks.bookmark,
  );
  const bookmarkdelete = useSelector(
    (state) => state.collectivebookmarks?.delete || {},
  );
  const [group, setGroup] = useState('');

  // after deletion of bookmark (state.collectivebookmarks?.delete changed to 'loaded')
  React.useEffect(() => {
    if (token && bookmarkdelete === 'loaded') {
      const url = new URL(document.location);
      let uid = content?.UID;
      let grp = 'default_nogroup';
      if (uid) {
        let default_token = [
          { token: url.search ? 'default_search' : 'default_nogroup' },
        ];
        let grp_token = get(
          content,
          config.settings?.bookmarks?.bookmarkgroupfield,
          default_token,
        );
        grp =
          grp_token && grp_token.length > 0
            ? grp_token[0].token || grp_token
            : 'default_search';
        setGroup(grp);
        dispatch(getBookmark(uid, grp, url.search));
      }
    }
  }, [dispatch, token, content, bookmarkdelete]);

  // TODO Make event listeners configurable for other implementations of searchkit / faceted search
  React.useEffect(function mount() {
    window.addEventListener(
      'searchkitQueryChanged',
      searchOnUrlQueryStringChanged,
    );

    return function unMount() {
      window.removeEventListener(
        'searchkitQueryChanged',
        searchOnUrlQueryStringChanged,
      );
    };
  });

  function searchOnUrlQueryStringChanged(event) {
    // event handler for searchkitQueryChanged event of searchkit
    const url = new URL(document.location);
    setGroup('default_search');
    dispatch(getBookmark(content.UID, 'default_search', url.search));
  }

  function toggleBookmarkHandler() {
    const url = new URL(document.location);
    let [uid, querystring] = [content.UID, url.search];

    let grp = group;

    if (currentbookmark) {
      dispatch(deleteBookmark(uid, grp, doStringifySearchquery(querystring)));
    } else {
      dispatch(addBookmark(uid, grp, querystring, {}));
    }
  }

  return token ? (
    <Button
      icon
      basic
      id="toolbar-addbookmark"
      className="addbookmark"
      aria-label={intl.formatMessage(messages.label_addbookmark)}
      onClick={() => toggleBookmarkHandler()}
    >
      <Icon
        name={currentbookmark ? bookmarkFilledSVG : bookmarkSVG}
        size="30px"
        title={intl.formatMessage(messages.label_addbookmark)}
      />
    </Button>
  ) : null;
};

export default injectIntl(ToggleBookmarkButton);
