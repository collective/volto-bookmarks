/**
 * Button to bookmarks list
 * integrate in toolbar
 * see ShowBookmarksContentButton for a button to integrate in in main section
 */
import React, { useState } from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Icon } from '@plone/volto/components';
import bookSVG from '@plone/volto/icons/book.svg';
import { Plug } from '@plone/volto/components/manage/Pluggable';

const messages = defineMessages({
  label_showbookmarksmenu: {
    id: 'label_showbookmarksmenu',
    defaultMessage: 'show bookmarks menu',
  },
});

const ShowBookmarksToolbarButton = () => {
  const token = useSelector((state) => state.userSession?.token);
  const intl = useIntl();

  return __CLIENT__ && token ? (
    <>
      <Plug pluggable="main.toolbar.bottom" id="bookmarks-menu">
        {({ onClickHandler }) => {
          console.log('onClickHandler', onClickHandler);
          return (
            <button
              className="show-bookmarks"
              aria-label={intl.formatMessage(messages.label_showbookmarksmenu)}
              onClick={(e) => onClickHandler(e, 'bookmarksMenu')}
              tabIndex={0}
              id="toolbar-show-bookmarks"
            >
              <Icon
                name={bookSVG}
                size="30px"
                title={intl.formatMessage(messages.label_showbookmarksmenu)}
              />
            </button>
          );
        }}
      </Plug>
    </>
  ) : null;
};

export default injectIntl(ShowBookmarksToolbarButton);
