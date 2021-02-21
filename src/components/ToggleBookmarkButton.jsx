import React, { useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { get, trimStart } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

// import bookmarkSVG from '@plone/volto/icons/bookmark.svg';
import bookmarkSVG from '../icons/bookmark.svg';
import bookmarkFilledSVG from '../icons/bookmark_filled.svg';

import { getBookmark, addBookmark, deleteBookmark } from '../actions';

import { BOOKMARKGROUPMAPPING, BOOKMARKGROUPFIELD } from '../constants';
let BMGM = BOOKMARKGROUPMAPPING;
let BMGF = BOOKMARKGROUPFIELD;
import('~/config.js')
  .then((config) => {
    BMGM = config.BOOKMARKGROUPMAPPING;
    BMGF = config.BOOKMARKGROUPFIELD;
  })
  .catch((error) => {
    console.info(
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

const ToggleBookmarkButton = ({ token, pathname, intl }) => {
  /**
   * Add a bookmark to owners bookmark list
   */

  // TODO location.search lacks order und sort:
  // ?q=&f=kompasscomponent_agg.kompasscomponent_token%3ABEW&l=list&p=1&s=10
  let location = useLocation(); //TODO that's not up to date for history.push.
  const content = useSelector((state) => state.content.data);
  const dispatch = useDispatch();
  // const [bookmarked, setBookmarked] = useState(false);
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
          ? grp_token[0].token
          : 'default_search';
      setGroup(grp);
      dispatch(getBookmark(content.UID, grp, url.search));
    }
  }, [dispatch, pathname, token, location, content]);

  // TODO Make event listeners configurable
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

  function getValuesFromSearchquery(sq, key) {
    /**
     * @collective/volto-search
     *
     * return dictionary
     * querystringvalues: string with list of selected filter values or other querystring values
     */
    const params = new URLSearchParams(trimStart(sq, '?'));
    let filter = params.getAll(key);
    let result = filter.map((flt) => flt.split(':').pop());
    // TODO do proper decoding
    let encodedString = result.join(', ').replaceAll('=', '%');
    let valuesString = decodeURI(encodedString);
    return valuesString;
  }

  function toggleBookmarkHandler() {
    const url = new URL(document.location);
    // TODO remove hack for loacation.search. see above useLocation.
    let [uid, searchquery] = [content.UID, url.search];
    if (currentbookmark) {
      dispatch(deleteBookmark(uid, group, searchquery));
    } else if (uid) {
      // TODO make this configurable and independent of @collective/volto-search
      let payload = {};
      let querystringvalues = [];
      querystringvalues.push(getValuesFromSearchquery(searchquery, 'q'));
      querystringvalues.push(getValuesFromSearchquery(searchquery, 'f'));
      querystringvalues = querystringvalues
        .filter((el) => el !== '')
        .join(' | ');
      payload['querystringvalues'] = querystringvalues;
      // TODO do proper encoding: Open Bookmark: should be recognized as already bookmarked
      dispatch(addBookmark(uid, group, searchquery, payload));
    }
  }

  return __CLIENT__ && token ? (
    <Button
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
