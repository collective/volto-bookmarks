import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { get, groupBy, sortBy } from 'lodash';

import { getAllBookmarks } from '@plone-collective/volto-bookmarks/actions';
import {
  deStringifySearchquery,
  parseSearchBlockQuery,
  translateSearch,
} from '@plone-collective/volto-bookmarks/helpers';
import MenuItem from '@plone-collective/volto-bookmarks/components/MenuItem';

import './volto-bookmarks.css';

import config from '@plone/volto/registry';

function getTitle(queryparams) {
  const searchParams = new URLSearchParams(deStringifySearchquery(queryparams));

  const b_size = searchParams.get('b_size');

  // default search block
  if (b_size) {
    const query = searchParams.getAll('query');
    let parsed = parseSearchBlockQuery(query);

    const title_array = [];
    Object.keys(parsed)
      .reverse()
      .forEach((key) => {
        if (key === 'path') {
          //
        } else if (key === 'SearchableText') {
          title_array.push(`«${parsed[key]}»`);
        } else {
          parsed[key].forEach((value) => {
            title_array.push(translateSearch(value, 'facet_fields'));
          });
        }
      });
    let search_bookmark_title = title_array.join(', ');
    return search_bookmark_title;
  }

  // searchkit block of volto-searchkit-block
  const filters = searchParams.getAll('f');
  const query = searchParams.get('q');

  const title_array = [];
  let section = '';
  if (query) {
    title_array.push(`«${query}»`);
  }
  filters.forEach((el) => {
    let foo = el.split(':');
    if (foo[0] !== 'section') {
      const el = foo[1].replace('_agg', '');
      title_array.push(translateSearch(el, 'facet_fields'));
    } else {
      section = translateSearch(foo[1], 'search_sections');
    }
  });

  let search_bookmark_title = title_array.join(', ');
  search_bookmark_title = section
    ? `${section}: ${search_bookmark_title}`
    : search_bookmark_title;

  return search_bookmark_title;
}

const BookmarksEditorComponent = () => {
  const token = useSelector((state) => state.userSession.token);
  const items = useSelector((state) => state.collectivebookmarks?.items || []);

  const dispatch = useDispatch();

  let [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    if (token) {
      dispatch(getAllBookmarks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    let grtms = groupBy(items, (item) => item['group']);
    Object.keys(grtms).forEach((kk) => {
      let foo = grtms[kk].map((item) => {
        item.title = getTitle(item.queryparams) || item.title;
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
                  return <MenuItem item={item} key={item.created} />;
                })}
              </ul>
            </li>
          );
        })}
    </ul>
  );
};

export default BookmarksEditorComponent;
