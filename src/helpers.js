import config from '@plone/volto/registry';

const _translate = (el, type) => {
  const mapping = config.settings?.bookmarks?.filtermapping;
  return mapping ? mapping[type][el] || el : el;
};

/**
 * @function _getValuesFromSearchquery
 * @param {string} querystring querystring of url
 * @param {string} key
 * @return {string} joined values of querystring key
 */
function _getValuesFromSearchquery(querystring, key) {
  const params = new URLSearchParams(querystring);
  let filter = params.getAll(key);
  let filters = [];
  let sections = [];
  filter.forEach((flt) => {
    let foo = flt.split(':');
    foo[0] === 'section'
      ? sections.push(foo[1])
      : foo[0] && filters.push(
          ['q', 'Subject', 'SearchableText'].includes(key)
            ? `«${foo[1] || foo[0]}»`
            : foo[1] || foo[0],
        );
  });
  const result = {
    filters: filters.map((el) => _translate(el, 'facet_fields')).join(', '),
    sections: sections
      .map((el) => _translate(el, 'search_sections'))
      .join(', '),
  };
  return result;
}

/**
 * Title for search query shown in bookmarks list
 * q,f for @rohberg/volto-searchkit
 * Add more querystring keys if needed
 * @function querystringToTitle
 * @param {string} querystring querystring of url
 * @return {string} joined values of querystring
 */
function querystringToTitle(querystring) {
  // TODO do proper decoding!
  querystring = querystring
    .replaceAll('%3D', '%')
    .replaceAll('%3A', ':')
    .replaceAll('%2F', '/');
  querystring = decodeURI(querystring);
  let querystringvalues = [];
  let sections = [];
  ['q', 'f', 'Subject', 'SearchableText'].forEach((el) => {
    const vls = _getValuesFromSearchquery(querystring, el);
    vls['filters'] && querystringvalues.push(vls['filters']);
    vls['sections'] && sections.push(vls['sections']);
  });
  let res = [];
  querystringvalues.length > 0 && res.push(querystringvalues.join(', '));
  sections.length > 0 &&
    res.push(`in ${sections.filter((el) => el !== '').join(', ')}`);
  return res.join(' ');
}

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

export { deStringifySearchquery, doStringifySearchquery, querystringToTitle };
