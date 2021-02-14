import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Portal } from 'react-portal';
import { Icon } from '@plone/volto/components';
import bookSVG from '@plone/volto/icons/book.svg';

const messages = defineMessages({
  label_showbookmarksmenu: {
    id: 'label_showbookmarksmenu',
    defaultMessage: 'show bookmarks menu',
  },
});

const ShowBookmarksComponent = ({ token, intl }) => {
  return __CLIENT__ && token ? (
    <Portal
      node={__CLIENT__ && document.querySelector('#toolbar .toolbar-bottom')}
    >
      <Link
        id="toolbar-bookmarkmenu"
        className="bookmarkmenu"
        title={intl.formatMessage(messages.label_showbookmarksmenu)}
        aria-label={intl.formatMessage(messages.label_showbookmarksmenu)}
        to="/collectivebookmarks"
      >
        <Icon
          name={bookSVG}
          // className="circled"
          size="30px"
          title={intl.formatMessage(messages.label_showbookmarksmenu)}
        />
      </Link>
    </Portal>
  ) : null;
};

export default injectIntl(ShowBookmarksComponent);
