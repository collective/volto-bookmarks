import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';

import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import deleteSVG from '@plone/volto/icons/clear.svg';

import { deleteBookmark } from '@plone-collective/volto-bookmarks/actions';
import { fetchBookmarksAtom } from '@plone-collective/volto-bookmarks/atoms';
import { normalizeQueryparams } from '@plone-collective/volto-bookmarks/helpers';

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
    await deleteBookmark(uid, group, searchquery);
    setDeleted(true);
    fetchBookmarks();
  }

  // Old bookmarks store queryparams as JSON, new ones as querystring.
  // Keep item.queryparams untouched for deletion: the backend identifies
  // the bookmark by the stored value.
  const querystring = normalizeQueryparams(item.queryparams);
  const url = `${flattenToAppURL(item['@id']) + '?' + querystring}`;

  return !deleted ? (
    <li className="bookmarkitem" key={item['@id']}>
      <Link
        title={item.description || ''}
        to={url}
        onClick={() => {
          // Hack: Select a bookmark of a search, then select another bookmark of another search.
          // Search is triggered!
          // Criterion: search parameters do exist
          // Event 'popstate' triggers a search.
          if (querystring) {
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
