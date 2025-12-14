const API = "https://mvi9i8fe54.execute-api.ca-central-1.amazonaws.com";

export async function getServerStatus() {
  const res = await fetch(`${API}/status`);
  if (!res.ok) throw new Error("Failed to get status");

  // returns: { instanceState, publicIp }
  return res.json();
}

export async function startServer() {
  const res = await fetch(`${API}/start`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to start server");
}

export async function stopServer() {
  const res = await fetch(`${API}/stop`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to stop server");
}
