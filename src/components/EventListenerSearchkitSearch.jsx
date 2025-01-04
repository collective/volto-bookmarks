import React from 'react';
import { useDispatch } from 'react-redux';

import { getAllBookmarks } from '@plone-collective/volto-bookmarks/actions';

const EventListenerSearchkitSearch = () => {
  const dispatch = useDispatch();
  // TODO Make event listeners configurable for other implementations of searchkit / faceted search
  // see window.addEventListener('popstate', handlePop);
  // see RouteAnnouncer of Volto core

  function searchOnUrlQueryStringChanged(event) {
    // event handler for searchkitQueryChanged event of searchkit
    dispatch(getAllBookmarks());
  }

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

  return <React.Fragment></React.Fragment>;
};

export default EventListenerSearchkitSearch;
