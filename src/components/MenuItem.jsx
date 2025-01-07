import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';

import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import deleteSVG from '@plone/volto/icons/clear.svg';

import {
  deleteBookmark,
  getAllBookmarks,
} from '@plone-collective/volto-bookmarks/actions';
import { generateSearchQueryParamsString } from '@plone-collective/volto-bookmarks/helpers';

const messages = defineMessages({
  title_bookmarks: {
    id: 'title_bookmarks',
    defaultMessage: 'Bookmarks',
  },
  bookmark_searchquery: {
    id: 'bookmark_searchquery',
    defaultMessage: 'Search for ',
  },
  label_deletebookmark: {
    id: 'label_deletebookmark',
    defaultMessage: 'delete bookmark',
  },
});

const MenuItem = ({ intl, item }) => {
  const dispatch = useDispatch();
  let [deleted, setDeleted] = useState(false);

  function deleteBookmarkHandler(uid, group, searchquery) {
    setDeleted(true);
    dispatch(deleteBookmark(uid, group, searchquery)).then(() => {
      dispatch(getAllBookmarks());
    });
  }

  return !deleted ? (
    <li className="bookmarkitem" key={item['@id']}>
      <Link
        title={item.description || ''}
        to={`${
          flattenToAppURL(item['@id']) +
          '?' +
          generateSearchQueryParamsString(item.queryparams)
        }`}
        onClick={() => {
          // Hack: Select a bookmark of a search, then select another bookmark of another search.
          // Search is triggered!
          // Criterion: search parameters do exist
          // Event 'popstate' triggers a search.
          const url = `${
            flattenToAppURL(item['@id']) +
            '?' +
            generateSearchQueryParamsString(item.queryparams)
          }`;
          const queryparams_object = item.queryparams
            ? JSON.parse(item.queryparams)
            : {};
          if (Object.keys(queryparams_object).length > 0) {
            window.history.pushState({}, 'search bookmark', url);
            let evt = new CustomEvent('popstate', {
              detail: {},
            });
            dispatchEvent(evt);
          }
        }}
      >
        {item.title}
      </Link>
      <Button
        icon
        basic
        className="deletebookmark"
        aria-label={intl.formatMessage(messages.label_deletebookmark)}
        onClick={() =>
          deleteBookmarkHandler(item.uid, item.group, item.queryparams || '')
        }
      >
        <Icon
          name={deleteSVG}
          // className="circled"
          size="25px"
          title="Bookmark löschen"
        />
      </Button>
    </li>
  ) : null;
};

export default injectIntl(MenuItem);
