import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';

import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import deleteSVG from '@plone/volto/icons/clear.svg';

import { deleteBookmark } from '@plone-collective/volto-bookmarks/actions';
import { fetchBookmarksAtom } from '@plone-collective/volto-bookmarks/atoms';

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
  const fetchBookmarks = useSetAtom(fetchBookmarksAtom);
  let [deleted, setDeleted] = useState(false);

  async function deleteBookmarkHandler(uid, group, searchquery) {
    const response = await deleteBookmark(uid, group, searchquery);
    if (response.ok) {
      setDeleted(true);
      fetchBookmarks();
    }
  }

  return !deleted ? (
    <li className="bookmarkitem" key={item['@id']}>
      <Link
        title={item.description || ''}
        to={`${flattenToAppURL(item['@id']) + '?' + item.queryparams}`}
        onClick={() => {
          // Hack: Select a bookmark of a search, then select another bookmark of another search.
          // Search is triggered!
          // Criterion: search parameters do exist
          // Event 'popstate' triggers a search.
          const url = `${
            flattenToAppURL(item['@id']) + '?' + item.queryparams
          }`;

          if (item.queryparams) {
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
