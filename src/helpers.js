import { trimStart } from 'lodash';

function querystringToTitle(qs) {
  return 'I am a title';
}

function doStringifySearchquery(searchquery) {
  // return searchquerystring as it is
  return trimStart(
    searchquery.replace(/&/g, 'ampsign').replace(/%3A/g, 'colonsign'),
    '?',
  );
  //   const params = new URLSearchParams(trimStart(searchquery, '?'));
  //   return JSON.stringify(Object.fromEntries(params));
}
function deStringifySearchquery(searchquery) {
  return (
    '?' + searchquery.replace(/ampsign/g, '&').replace(/colonsign/g, '%3A')
  );
}

export { deStringifySearchquery, doStringifySearchquery, querystringToTitle };
