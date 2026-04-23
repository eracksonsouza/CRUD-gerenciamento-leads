import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/leads"),
    handler: async (req, res) => {
      const { search } = req.query;

      const leads = await database.select(
        "leads",
        search ? { name: search, email: search } : null
      );

      return res.writeHead(200).end(JSON.stringify(leads));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/leads"),
    handler: async (req, res) => {
      const { name, email } = req.body;

      const lead = await database.insert("leads", {
        id: randomUUID(),
        name,
        email,
        contacted: false,
      });

      return res
        .writeHead(201)
        .end(JSON.stringify({ message: "Lead criado com sucesso!", lead }));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/leads/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;

      const lead = await database.findById("leads", id);

      if (!lead) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Lead nao encontrado" }));
      }

      await database.update("leads", id, { name, email });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/leads/:id"),
    handler: async (req, res) => {
      const { id } = req.params;

      const lead = await database.findById("leads", id);

      if (!lead) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Lead nao encontrado" }));
      }

      await database.delete("leads", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/leads/:id/contact"),
    handler: async (req, res) => {
      const { id } = req.params;

      const lead = await database.findById("leads", id);

      if (!lead) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Lead nao encontrado" }));
      }

      await database.update("leads", id, {
        name: lead.name,
        email: lead.email,
        contacted: !lead.contacted,
      });

      return res.writeHead(204).end();
    },
  },
];
