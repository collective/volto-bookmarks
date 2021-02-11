import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { Portal } from 'react-portal';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';
import bookSVG from '@plone/volto/icons/book.svg';

const ShowBookmarksComponent = ({ token }) => {
  return __CLIENT__ && token ? (
    <Portal
      node={__CLIENT__ && document.querySelector('#toolbar .toolbar-bottom')}
    >
      <Link
        id="toolbar-bookmarkmenu"
        className="bookmarkmenu"
        title="Bookmarks-Menu zeigen"
        aria-label="Bookmarks-Menu zeigen"
        to="/collectivebookmarks"
      >
        <Icon
          name={bookSVG}
          // className="circled"
          size="30px"
          title="Bookmarks-Menu zeigen"
        />
      </Link>
    </Portal>
  ) : null;
};

export default ShowBookmarksComponent;
