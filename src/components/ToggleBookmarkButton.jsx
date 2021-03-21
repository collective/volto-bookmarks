import React, { useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

// import bookmarkSVG from '@plone/volto/icons/bookmark.svg';
import bookmarkSVG from '../icons/bookmark.svg';
import bookmarkFilledSVG from '../icons/bookmark_filled.svg';

import { getBookmark, addBookmark, deleteBookmark } from '../actions';

import { querystringToTitle } from '../helpers';

import { BOOKMARKGROUPMAPPING, BOOKMARKGROUPFIELD } from '../constants';
let BMGM = BOOKMARKGROUPMAPPING;
let BMGF = BOOKMARKGROUPFIELD;
import('~/config.js')
  .then((config) => {
    BMGM = config.BOOKMARKGROUPMAPPING;
    BMGF = config.BOOKMARKGROUPFIELD;
  })
  .catch((error) => {
    console.warning(
      error,
      'Think about configuring BOOKMARKGROUPMAPPING and BOOKMARKGROUPFIELD in your project',
    );
  });

const messages = defineMessages({
  label_addbookmark: {
    id: 'label_addbookmark',
    defaultMessage: 'add or delete bookmark',
  },
});

/**
 * Add a bookmark to owners bookmark list
 */
const ToggleBookmarkButton = ({ token, pathname, intl }) => {
  // TODO location.search lacks order und sort:
  // ?q=&f=kompasscomponent_agg.kompasscomponent_token%3ABEW&l=list&p=1&s=10
  let location = useLocation(); //TODO that's not up to date for history.push.
  const content = useSelector((state) => state.content.data);
  const dispatch = useDispatch();
  const currentbookmark = useSelector(
    (state) => state.collectivebookmarks.bookmark,
  );
  const [group, setGroup] = useState('');

  React.useEffect(() => {
    if (content?.UID && token) {
      const url = new URL(document.location);
      let default_token = [
        { token: url.search ? 'default_search' : 'default_nogroup' },
      ];
      let grp_token = get(content, BMGF, default_token);
      let grp =
        grp_token && grp_token.length > 0
          ? grp_token[0].token || grp_token
          : 'default_search';
      setGroup(grp);
      dispatch(getBookmark(content.UID, grp, url.search));
    }
  }, [dispatch, pathname, token, location, content]);

  // TODO Make event listeners configurable for other implementations of searchkit / faceted searches
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
    // TODO remove hack for location.search. see above useLocation.
    let [uid, querystring] = [content.UID, url.search];
    if (currentbookmark) {
      dispatch(deleteBookmark(uid, group, querystring));
    } else {
      // TODO remove this hack for Plone default search if Plone site root is dexterity and has a uid
      if (url.pathname === '/search') {
        uid = '886313e1-3b8a-5372-9b90-0c9aee199e5d'; // arbitrary but not changing uid
        setGroup('default_search');
      }
      let payload = {
        querystringvalues: querystringToTitle(querystring),
      };
      dispatch(addBookmark(uid, group, querystring, payload));
    }
  }

  return __CLIENT__ && token ? (
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
