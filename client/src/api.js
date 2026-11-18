// client/src/api.js  --  talks to the Express backend

async function request(path, options) {
  let res;

  try {
    res = await fetch(path, options);
  } catch {
    throw new Error(
      "Cannot reach the backend server. Make sure it is running."
    );
  }

  let data;

  try {
    data = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }

    throw new Error(
      "Invalid response from the backend. Expected JSON data."
    );
  }

  if (!res.ok) {
    throw new Error(
      data?.error || `Request failed (${res.status})`
    );
  }

  if (
    data === null ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    throw new Error(
      "Invalid response from the backend. Expected a JSON object."
    );
  }

  return data;
}

const post = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getConfig = () => request("/api/config");
export const runSimulation = (params) => post("/api/simulate", params);
export const compareOrderSizes = (params) => post("/api/compare", params);
