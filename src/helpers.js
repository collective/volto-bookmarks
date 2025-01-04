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
 * doStringifySearchquery
 * @function doStringifySearchquery
 * @param {string} querystring querystring of url
 * @return {string} ready for 'get' request. part of unique identifier of a bookmark
 */
function doStringifySearchquery(querystring) {
  const params = new URLSearchParams(querystring);
  let obj = {};
  for (var key of params.keys()) {
    obj[key] = params.getAll(key);
  }
  return JSON.stringify(obj);
}

/**
 * deStringifySearchquery
 * counterpart of doStringifySearchquery
 * @function deStringifySearchquery
 * @param {string} searchparamstring Json stringified object with search params (values are lists!)
 * @return {string} querystring, ready to use in url
 */
function deStringifySearchquery(searchparamstring) {
  const obj = JSON.parse(searchparamstring);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    for (const el of value) {
      // params[key] = el;
      params.append(key, el);
    }
  }
  return params.toString();
}

function parseSearchBlockQuery(query) {
  const q = JSON.parse(query);
  let obj = {};
  q.forEach((el) => {
    obj[el.i] = el.v;
  });
  return obj;
}

export {
  deStringifySearchquery,
  doStringifySearchquery,
  parseSearchBlockQuery,
  translateSearch,
};
