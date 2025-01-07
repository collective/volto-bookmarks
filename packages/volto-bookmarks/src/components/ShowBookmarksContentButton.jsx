/**
 * Button to bookmarks list
 * integrate in main
 * see ShowBookmarksToolbarButton for a button to integrate in toolbar
 */
import React from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { Dropdown } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { Icon } from '@plone/volto/components';
import bookSVG from '@plone/volto/icons/book.svg';

import BookmarksEditorComponent from './BookmarksEditorComponent';

const messages = defineMessages({
  label_showbookmarksmenu: {
    id: 'label_showbookmarksmenu',
    defaultMessage: 'show bookmarks menu',
  },
});

const ShowBookmarksContentButton = () => {
  const token = useSelector((state) => state.userSession?.token);
  const intl = useIntl();
  const [isClient, setIsClient] = React.useState(null);

  React.useEffect(() => setIsClient(true), []);

  return isClient && token ? (
    <Dropdown
      className="right floating bookmarkmenu"
      title={intl.formatMessage(messages.label_showbookmarksmenu)}
      aria-label={intl.formatMessage(messages.label_showbookmarksmenu)}
      icon={
        <Icon
          name={bookSVG}
          size="30px"
          title={intl.formatMessage(messages.label_showbookmarksmenu)}
        />
      }
    >
      <Dropdown.Menu className="left">
        <Dropdown.Item>
          <BookmarksEditorComponent />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <React.Fragment></React.Fragment>
  );
};

export default injectIntl(ShowBookmarksContentButton);
