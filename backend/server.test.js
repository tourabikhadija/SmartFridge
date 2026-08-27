const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { app } = require("./server");

test("health route responds without starting MongoDB", async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "SmartFridge Backend is running!");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
