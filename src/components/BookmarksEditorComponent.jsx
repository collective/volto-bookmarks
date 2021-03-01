import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { get, groupBy, sortBy } from 'lodash';

import { Button, Container } from 'semantic-ui-react';

import { Helmet, flattenToAppURL } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';

import deleteSVG from '@plone/volto/icons/clear.svg';

import { getBookmarks } from '../actions';
import { deStringifySearchquery } from '../helpers';

import { deleteBookmark } from '../actions';
import './volto-bookmarks.css';

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
  title_bookmarks: {
    id: 'title_bookmarks',
    defaultMessage: 'Bookmarks',
  },
  bookmark_searchquery: {
    id: 'bookmark_searchquery',
    defaultMessage: 'Search for ',
  },
  no_bookmark_groupname: {
    id: 'no_bookmark_groupname',
    defaultMessage:
      'No group name found. Add a name to your BOOKMARKGROUPMAPPING.',
  },
});

const BookmarksEditorComponent = ({ intl }) => {
  const token = useSelector((state) => state.userSession.token);
  const items = useSelector((state) => state.collectivebookmarks?.items || []);
  const dispatch = useDispatch();

  let [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    if (token) {
      dispatch(getBookmarks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    // group items, set title, sort by title
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
  }, [dispatch, items]);

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
        defaultMessage="You do not have bookmarks. On the left of a page you find a button to save a bookmark."
      />
    </div>
  ) : (
    <ul className="volto-bookmarks-list">
      {Object.keys(groupedItems)
        .sort()
        .map((grp, index) => {
          return (
            <li basic className="bookmarkgroup" key={index}>
              <h3>
                {get(
                  BMGM,
                  grp,
                  intl.formatMessage(messages.no_bookmark_groupname),
                )}
              </h3>
              <ul>
                {groupedItems[grp].map((item, index) => {
                  return (
                    <li basic className="bookmarkitem" key={index}>
                      {/* TODO replace hack to transform api url to app url */}
                      <Link
                        title={item.description || ''}
                        to={`${
                          flattenToAppURL(item['@id']) +
                          deStringifySearchquery(item.queryparams)
                        }`}
                      >
                        {item.title}
                      </Link>
                      <Button
                        icon
                        basic
                        className="addbookmark"
                        aria-label="Bookmark speichern/löschen"
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
