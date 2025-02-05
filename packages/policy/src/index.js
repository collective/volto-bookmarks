import Bookmarking from '@plone-collective/volto-bookmarks/components/Bookmarking';
import ListingVariationTemplateWithBookmarks from './components/ListingVariationTemplateWithBookmarks';

const applyConfig = (config) => {
  config.settings.appExtras = [
    ...config.settings.appExtras,
    {
      match: '/',
      component: Bookmarking,
    },
  ];

  config.settings.bookmarks.bookmarkgroupmapping = {
    ...config.settings.bookmarks.bookmarkgroupmapping,
    'News Item': 'News',
  };

  config.settings.bookmarks.filtermapping = {
    facet_fields: {
      'News Item': 'News Item',
      Document: 'Page',
      Event: 'Event',
    },
    search_sections: {
      others: 'Website',
      news: 'News',
    },
  };

  // Variation with one bookmark button per listing item
  config.blocks.blocksConfig.listing.variations.push({
    id: 'intranet1',
    title: 'Intranet 1',
    template: ListingVariationTemplateWithBookmarks,
  });

  return config;
};

export default applyConfig;
