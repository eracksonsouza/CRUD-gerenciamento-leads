import http from "node:http";
import fs from "node:fs/promises";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const swaggerSpecPath = new URL("./swagger.json", import.meta.url);

const swaggerUIHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>CRM Leads — Documentação</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: "/docs/swagger.json",
      dom_id: "#swagger-ui",
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: "BaseLayout",
    });
  </script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/docs") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(swaggerUIHtml);
  }

  if (method === "GET" && url === "/docs/swagger.json") {
    const spec = await fs.readFile(swaggerSpecPath, "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(spec);
  }

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};
    return route.handler(req, res);
  }

  return res.writeHead(404).end("Not Found");
});

const PORT = process.env.PORT ?? 3333;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}!`);
  console.log(`📄 Documentação disponível em http://localhost:${PORT}/docs`);
});
