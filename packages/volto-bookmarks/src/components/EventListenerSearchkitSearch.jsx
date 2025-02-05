import React from 'react';
import { useDispatch } from 'react-redux';

import { getAllBookmarks } from '@plone-collective/volto-bookmarks/actions';

// event handler for searchkitQueryChanged event of package react-searchkit
const EventListenerSearchkitSearch = () => {
  const dispatch = useDispatch();

  function searchOnUrlQueryStringChanged(event) {
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
