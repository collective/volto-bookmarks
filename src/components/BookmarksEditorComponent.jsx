import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { get, groupBy, sortBy } from 'lodash';

import { Button } from 'semantic-ui-react';

import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';

import deleteSVG from '@plone/volto/icons/clear.svg';

import { getAllBookmarks } from '../actions';
import { deStringifySearchquery } from '../helpers';

import { deleteBookmark } from '../actions';
import './volto-bookmarks.css';

import config from '@plone/volto/registry';

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

const BookmarksEditorComponent = ({ intl }) => {
  const token = useSelector((state) => state.userSession.token);
  const items = useSelector((state) => state.collectivebookmarks?.items || []);
  const bookmarkdelete = useSelector(
    (state) => state.collectivebookmarks?.delete || {},
  );
  const dispatch = useDispatch();

  let [groupedItems, setGroupedItems] = useState({});

  /* getBookmorks on
   * - mount
   * - after deletion of bookmark
   * - after login
   */

  // on mount
  // on login
  useEffect(() => {
    if (token) {
      dispatch(getAllBookmarks());
    }
  }, [dispatch, token]);

  // after deletion of bookmark (state.collectivebookmarks?.delete changed to 'loaded')
  useEffect(() => {
    if (token && bookmarkdelete === 'loaded') {
      dispatch(getAllBookmarks());
    }
  }, [dispatch, bookmarkdelete]);

  useEffect(() => {
    let grtms = groupBy(items, (item) => item['group']);
    Object.keys(grtms).forEach((kk) => {
      let foo = grtms[kk].map((item) => {
        item.title = item.payload?.querystringvalues
          ? intl.formatMessage(messages.bookmark_searchquery) +
            item.payload?.querystringvalues
          : item.title;
        return item;
      });
      let bar = sortBy(foo, [
        function (o) {
          return o.title.toLowerCase();
        },
      ]);
      grtms[kk] = bar;
    });
    setGroupedItems(grtms);
  }, [dispatch, items, intl]);

  function deleteBookmarkHandler(uid, group, searchquery) {
    dispatch(deleteBookmark(uid, group, searchquery));
  }

  return !token ? (
    <div className="volto-bookmarks-info">
      <FormattedMessage
        id="help_bookmarks_anonymous"
        defaultMessage="Please login to see your bookmarks"
      />
    </div>
  ) : items?.length === 0 ? (
    <div className="volto-bookmarks-info">
      <FormattedMessage
        id="help_bookmarks_emptylist"
        defaultMessage="You don't have any bookmarks. You find a button on every page to bookmark it."
      />
    </div>
  ) : (
    <ul className="volto-bookmarks-list">
      {Object.keys(groupedItems)
        .sort()
        .map((grp, index) => {
          return (
            <li className="bookmarkgroup" key={index}>
              <h3>
                {get(
                  config.settings?.bookmarks?.bookmarkgroupmapping,
                  grp,
                  grp,
                )}
              </h3>
              <ul>
                {groupedItems[grp].map((item, index) => {
                  return (
                    <li className="bookmarkitem" key={index}>
                      <Link
                        title={item.description || ''}
                        to={`${
                          flattenToAppURL(item['@id']) +
                          '?' +
                          deStringifySearchquery(item.queryparams)
                        }`}
                        onClick={() => {
                          // Hack: Select bookmark of search, then select bookmark of search.
                          // Search is triggered!
                          // Criterion: search parameter 'q' ist provided
                          // Event 'popstate' triggers a search.
                          const url = `${
                            flattenToAppURL(item['@id']) +
                            '?' +
                            deStringifySearchquery(item.queryparams)
                          }`;
                          const queryparams_object = item.queryparams
                            ? JSON.parse(item.queryparams)
                            : {};
                          if (queryparams_object.q) {
                            window.history.pushState(
                              {},
                              'search bookmark',
                              url,
                            );
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
                        aria-label={intl.formatMessage(
                          messages.label_deletebookmark,
                        )}
                        onClick={() =>
                          deleteBookmarkHandler(
                            item.uid,
                            item.group,
                            item.queryparams || '',
                          )
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
                  );
                })}
              </ul>
            </li>
          );
        })}
    </ul>
  );
};

export default injectIntl(BookmarksEditorComponent);
