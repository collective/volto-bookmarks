import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { useAtom } from 'jotai';
import { fetchBookmarksAtom } from '@plone-collective/volto-bookmarks/atoms';

import {
  parseSearchBlockQuery,
  translateSearch,
} from '@plone-collective/volto-bookmarks/helpers';
import MenuItem from '@plone-collective/volto-bookmarks/components/MenuItem';

import './volto-bookmarks.css';

import config from '@plone/volto/registry';

function getTitle(queryparams) {
  const searchParamsObject = new URLSearchParams(queryparams);

  let query = searchParamsObject.get('query');

  // default search block
  if (query && query.length > 0) {
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
  let title_array = [];
  query = searchParamsObject.get('q');
  let filters = searchParamsObject.getAll('f');
  let section = '';

  if (query && query[0].length) {
    title_array.push(`«${query}»`);
  }

  if (typeof filters === 'string') {
    filters = [filters];
  }

  if (filters && filters.length > 0) {
    // backward compatibility to old filter format
    filters.forEach((el) => {
      let foo = el.split(':');
      if (foo[0] === 'section') {
        section = translateSearch(foo[1], 'search_sections');
      } else {
        const el = foo[1].replace('_agg', '');
        title_array.push(translateSearch(el, 'facet_fields'));
      }
    });
  } else if (filters) {
    Object.keys(filters).forEach((filterkey) => {
      if (filterkey === 'section') {
        section = translateSearch(filters[filterkey], 'search_sections');
      } else {
        title_array.push(
          translateSearch(
            filters[filterkey].replace('_agg', ''),
            'facet_fields',
          ),
        );
      }
    });
  }

  let search_bookmark_title = title_array.join(', ');
  search_bookmark_title = section
    ? `${section}: ${search_bookmark_title}`
    : search_bookmark_title;
  return search_bookmark_title;
}

const BookmarksEditorComponent = () => {
  const token = useSelector((state) => state.userSession.token);

  const [bookmarks, fetchBookmarks] = useAtom(fetchBookmarksAtom);

  let [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [fetchBookmarks, token]);

  useEffect(() => {
    let grtms = groupBy(bookmarks.items, (item) => item['group']);
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
  }, [bookmarks.items]);

  return !token ? (
    <div className="volto-bookmarks-info">
      <FormattedMessage
        id="help_bookmarks_anonymous"
        defaultMessage="Please login to see your bookmarks"
      />
    </div>
  ) : bookmarks.items_total === 0 ? (
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
