import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/leads",
    handler: (req, res) => {
      const leads = database.select("leads");
      return res.writeHead(200).end(JSON.stringify(leads));
    },
  },
  {
    method: "POST",
    path: "/leads",
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
