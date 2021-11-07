import fetch from 'unfetch';
import qs from 'query-string';

export async function api(url: string, query?: Record<string, any>) {
  if (query) {
    url += '?' + qs.stringify(query);
  }
  return await (await fetch(process.env.REACT_APP_API_URL + url)).json();
}
