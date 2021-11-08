import fetch from 'unfetch';

export async function api(url: string, body?: any) {
  return await (
    await fetch(process.env.REACT_APP_API_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    })
  ).json();
}
