import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";

const server = http.createServer(async (req, res) => {
  await json(req, res);
  const { method, url } = req;
  const route = routes.find(
    (route) => route.method === method && route.path === url
  );

  if (route) {
    return route.handler(req, res);
  }

  return res.writeHead(404).end("Not Found");
});

server.listen(3333, () => {
  console.log("🚀 Servidor rodando na porta 3333!");
});
