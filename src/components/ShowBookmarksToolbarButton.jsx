/**
 * Button to bookmarks list
 * integrate in toolbar
 * see ShowBookmarksContentButton for a button to integrate in in main section
 */
import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon } from '@plone/volto/components';
import bookSVG from '@plone/volto/icons/book.svg';
import { DropdownWithButton } from '@plone/volto/components/manage/Toolbar/Dropdown';

import BookmarksEditorComponent from './BookmarksEditorComponent';

const messages = defineMessages({
  label_showbookmarksmenu: {
    id: 'label_showbookmarksmenu',
    defaultMessage: 'show bookmarks menu',
  },
});

const ShowBookmarksToolbarButton = (props) => {
  let { token, intl } = props;
  return __CLIENT__ && token ? (
    <DropdownWithButton
      {...props}
      name="show-bookmarks"
      title="show bookmarks"
      icon={
        <Icon
          name={bookSVG}
          // className="circled"
          size="30px"
          title={intl.formatMessage(messages.label_showbookmarksmenu)}
        />
      }
    >
      <BookmarksEditorComponent />
    </DropdownWithButton>
  ) : null;
};

export default injectIntl(ShowBookmarksToolbarButton);
