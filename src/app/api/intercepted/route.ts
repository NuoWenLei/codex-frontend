export async function POST(request: Request) {
  const values = await request.json();
  const url = `http://54.90.74.38/api${values.backend_path}`;
  if (values.method == "GET") {
    return await fetch(url, {
      method: values.method,
    });
  }
  const r = await fetch(url, {
    method: values.method,
    body: JSON.stringify(values.body),
    headers: {
      "Content-Type": "Application/json",
    },
  });

  return r;
}
