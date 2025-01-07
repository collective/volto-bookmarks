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
 * generateSearchQueryObject
 * @function generateSearchQueryObject
 * @param {string} querystring querystring of url
 * @return {string} ready for 'get' request. part of unique identifier of a bookmark
 */
function generateSearchQueryObject(querystring) {
  const params = new URLSearchParams(querystring);
  let obj = {};
  for (let key of params.keys()) {
    const values = params.getAll(key);
    if (values.length > 1) {
      obj[key] = {};
      values.forEach((el) => {
        var [k, v] = el.split(':');
        obj[key][k] = v;
      });
    } else {
      obj[key] = values[0];
    }
  }
  return obj;
}

/**
 * generateSearchQueryParamsString
 * counterpart of generateSearchQueryObject
 * @function generateSearchQueryParamsString
 * @param {string} searchparamstring Json stringified object with search params (values are lists!)
 * @return {string} querystring, ready to use in url
 */
function generateSearchQueryParamsString(searchparamstring) {
  const obj = JSON.parse(searchparamstring);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value == 'string') {
      params.append(key, value);
    } else if (value.length > 0) {
      for (const el of value) {
        params.append(key, el);
      }
    } else {
      Object.keys(value).forEach((filterkey) => {
        params.append(key, `${filterkey}:${value[filterkey]}`);
      });
    }
  }
  return params.toString();
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

export {
  generateSearchQueryParamsString,
  generateSearchQueryObject,
  parseSearchBlockQuery,
  translateSearch,
};
