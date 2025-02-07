import { useAtom } from 'jotai';
import React from 'react';
import { searchkitQueryAtom } from '../atoms'; // Adjust the import path as necessary

// import { getAllBookmarks } from '@plone-collective/volto-bookmarks/actions';

// event handler for searchkitQueryChanged event of package react-searchkit
const EventListenerSearchkitSearch = () => {
  const [, setSearchkitQuery] = useAtom(searchkitQueryAtom);

  function searchOnUrlQueryStringChanged(event) {
    setSearchkitQuery(event.detail);
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
