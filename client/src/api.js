// client/src/api.js  --  talks to the Express backend

async function request(path, options) {
  const res = await fetch(path, options);
  let data = null;
  try {
    data = await res.json();
  } catch {
    // response had no JSON body
  }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
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
