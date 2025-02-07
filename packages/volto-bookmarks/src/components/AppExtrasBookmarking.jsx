import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSetAtom } from 'jotai';
import { fetchBookmarksAtom } from '@plone-collective/volto-bookmarks/atoms';

const AppExtrasBookmarking = () => {
  const fetchBookmarks = useSetAtom(fetchBookmarksAtom);

  const token = useSelector((state) => state.userSession.token);

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [fetchBookmarks, token]);

  return <React.Fragment></React.Fragment>;
};

export default AppExtrasBookmarking;
