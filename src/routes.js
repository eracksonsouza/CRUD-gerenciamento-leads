import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/route-path.js";
import path from "node:path";

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
  {
    method: "PUT",
    path: buildRoutePath("/leads/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;

      const leadExists = database
        .select("leads")
        .find((lead) => lead.id === id);

      if (!leadExists) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Lead nao encontrado" }));
      }

      database.update("leads", id, {
        name,
        email,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/leads/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const leadExist = database.select("leads").find((lead) => lead.id === id);

      if (!leadExist) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Lead nao encontrado" }));
      }

      database.delete("leads", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/leads/:id/contact"),
    handler: (req, res) => {
      const { id } = req.params;

      const leadExist = database.select("leads").find((lead) => lead.id === id);

      if (!leadExist) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Lead nao encontrado" }));
      }

      const contacted = leadExist.contacted !== undefined ? !leadExist.contacted : true;

      database.update("leads", id, {
        name: leadExist.name,
        email: leadExist.email,
        contacted,
      });

      return res.writeHead(204).end();
    },
  },
];
