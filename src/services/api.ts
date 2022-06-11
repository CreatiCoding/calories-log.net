import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new Error(
      error?.response?.data != null
        ? JSON.stringify(error?.response?.data)
        : error.message
    );
  }
);

function stringifyQuery(query: Record<string, string>) {
  const querystring = Object.entries(query).reduce((acc, cur, i) => {
    return acc + `${i === 0 ? "?" : "&"}${cur[0]}=${cur[1]}`;
  }, "");

  return querystring;
}

export async function get(url: string, query?: Record<string, string>) {
  try {
    const qs = query == null ? "" : stringifyQuery(query);

    const response = await instance.get(`${url}${qs}`);

    return response;
  } catch (error: any) {
    try {
      const { message } = JSON.parse(error.message);
      throw new Error(message);
    } catch {
      throw new Error(error.message);
    }
  }
}

export async function post(
  url: string,
  data?: Record<string, string | undefined>
) {
  try {
    return await instance.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    try {
      const { message } = JSON.parse(error.message);
      throw new Error(message);
    } catch {
      throw new Error(error.message);
    }
  }
}
