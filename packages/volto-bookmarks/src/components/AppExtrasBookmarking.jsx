import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllBookmarks } from '@plone-collective/volto-bookmarks/actions';

const FooComponent = () => {
  const token = useSelector((state) => state.userSession.token);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getAllBookmarks());
  }, [dispatch, token]);

  return <React.Fragment></React.Fragment>;
};

export default FooComponent;
