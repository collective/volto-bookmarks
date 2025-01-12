import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSetAtom } from 'jotai';
import { allBookmarksAtom } from '@plone-collective/volto-bookmarks/atoms';

const FooComponent = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(
    (state) => state.collectivebookmarks?.items || [],
  );
  const setAllBookmarksAtom = useSetAtom(allBookmarksAtom);

  React.useEffect(() => {
    setAllBookmarksAtom({ items: bookmarks });
  }, [dispatch, bookmarks, setAllBookmarksAtom]);

  return <React.Fragment></React.Fragment>;
};

export default FooComponent;
