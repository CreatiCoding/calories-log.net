function stringifyQuery(query: Record<string, string>) {
  const querystring = Object.entries(query).reduce((acc, cur, i) => {
    return acc + `${i === 0 ? "?" : "&"}${cur[0]}=${cur[1]}`;
  }, "");

  return querystring;
}

export async function get(url: string, query: Record<string, string>) {
  const qs = stringifyQuery(query);

  const response = await fetch(`${url}${qs}`);

  return await response.json();
}

export async function post(
  url: string,
  body: Record<string, string | undefined>
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
}
