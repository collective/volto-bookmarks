// OBSOLETE
import React from 'react';
import { useDispatch } from 'react-redux';

import { getAllBookmarks } from '@plone-collective/volto-bookmarks/actions';

const EventListenerSearch = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    function handlePop(event) {
      dispatch(getAllBookmarks());
    }

    window.addEventListener('popstate', handlePop);

    return () => {
      window.removeEventListener('popstate', handlePop);
    };
  }, [dispatch]);

  return <React.Fragment></React.Fragment>;
};

export default EventListenerSearch;
