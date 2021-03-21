/**
 * @function _getValuesFromSearchquery
 * @param {string} querystring querystring of url
 * @param {string} key
 * @return {string} joined values of querystring key
 */
function _getValuesFromSearchquery(querystring, key) {
  console.log('_getValuesFromSearchquery', key);
  const params = new URLSearchParams(querystring);
  let filter = params.getAll(key);
  let result = filter.map((flt) => flt.split(':').pop());
  let valuesString = result.join(', ');
  return valuesString;
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
  ['q', 'f', 'Subject', 'SearchableText'].forEach((el) => {
    querystringvalues.push(_getValuesFromSearchquery(querystring, el));
  });
  return querystringvalues.filter((el) => el !== '').join(' | ');
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
