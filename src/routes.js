import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/leads"),
    handler: (req, res) => {
      const { search } = req.query;

      const leads = database.select(
        "leads",
        search
          ? {
              name: search,
              email: search,
            }
          : null
      );

      return res.writeHead(200).end(JSON.stringify(leads));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/leads"),
    handler: (req, res) => {
      const { name, email } = req.body;

      const lead = {
        id: randomUUID(),
        name,
        email,
      };

      database.insert("leads", lead);

      return res
        .writeHead(201)
        .end(JSON.stringify({ message: "Lead criado com sucesso!", lead }));
    },
  },
];
