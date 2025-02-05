import config from '@plone/volto/registry';

/**
 *
 * @param {String} el facet value
 * @param {String} type 'facet_fields' or 'search_sections'
 * @returns
 */
const translateSearch = (el, type) => {
  const mapping = config.settings?.bookmarks?.filtermapping;
  return mapping ? (mapping[type] ? mapping[type][el] || el : el) : el;
};

/**
 * sortQuerystring
 * @function sortQuerystring
 * @param {string} querystring querystring of url
 * @return {string} ready for request. part of unique identifier of a bookmark
 */
function sortQuerystring(querystring) {
  if (!querystring) {
    return '';
  }
  let params = new URLSearchParams(querystring);
  params.sort();
  let sortedParams = params.toString();
  return sortedParams;
}

function parseSearchBlockQuery(query) {
  let obj = {};
  if (query.length === 0) {
    return obj;
  }
  const q = JSON.parse(query);
  q.forEach((el) => {
    obj[el.i] = el.v;
  });
  return obj;
}

export { sortQuerystring, parseSearchBlockQuery, translateSearch };
