# CRM — Gerenciamento de Leads

API REST para cadastro e acompanhamento de leads de marketing. Permite criar, listar, atualizar e remover leads, além de marcar contatos realizados e importar listas em massa via CSV.

## O que é este projeto

Sistema de CRM minimalista focado no ciclo de vida de um lead: desde o cadastro inicial até o registro de que o contato foi realizado. Não depende de nenhum framework HTTP — usa apenas o módulo nativo `node:http`.

## Como funciona (resumo)

1. Leads são criados via `POST /leads` com nome e e-mail.
2. O status de contato é alternado via `PATCH /leads/:id/contact`.
3. Listas grandes podem ser importadas em lote com o script `import-leads.js` a partir de um arquivo CSV.
4. A documentação interativa fica disponível em `/docs` (Swagger UI).

## Stack

- Node.js 20+ (ESM)
- JavaScript
- PostgreSQL
- csv-parse

### Badges

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)

## Demo

API em produção: **https://crud-gerenciamento-leads-production.up.railway.app**

Documentação interativa: **https://crud-gerenciamento-leads-production.up.railway.app/docs**

## Endpoints

| Método   | Rota                     | Descrição                                 |
|----------|--------------------------|-------------------------------------------|
| `GET`    | `/leads`                 | Lista todos os leads (suporta `?search=`) |
| `POST`   | `/leads`                 | Cria um novo lead                         |
| `PUT`    | `/leads/:id`             | Atualiza nome e e-mail de um lead         |
| `DELETE` | `/leads/:id`             | Remove um lead                            |
| `PATCH`  | `/leads/:id/contact`     | Alterna o status de contato do lead       |
| `GET`    | `/docs`                  | Swagger UI                                |

## Como rodar localmente

Pré-requisitos: Node.js 20+ e PostgreSQL.

```bash
git clone https://github.com/eracksonsouza/CRUD-gerenciamento-leads.git
cd CRUD-gerenciamento-leads
npm install
```

Crie `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/leads_db"
PORT=3333
```

Crie a tabela no banco:

```bash
psql $DATABASE_URL -f src/db.sql
```

Inicie o servidor:

```bash
npm run dev   # desenvolvimento (nodemon)
npm start     # produção
```

API disponível em http://localhost:3333

## Exemplos rápidos

**Criar um lead:**

```bash
curl -X POST http://localhost:3333/leads \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Silva", "email": "maria@email.com"}'
```

**Listar leads com filtro:**

```bash
curl "http://localhost:3333/leads?search=maria"
```

**Marcar como contatado:**

```bash
curl -X PATCH http://localhost:3333/leads/<id>/contact
```

**Atualizar dados:**

```bash
curl -X PUT http://localhost:3333/leads/<id> \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria S. Atualizada", "email": "novo@email.com"}'
```

**Remover lead:**

```bash
curl -X DELETE http://localhost:3333/leads/<id>
```

## Importar leads por CSV

Para importar uma lista em massa, coloque os dados em `leads.csv` na raiz do projeto no formato:

```csv
name,email
João Costa,joao@email.com
Ana Lima,ana@email.com
```

Execute o script de importação (com o servidor rodando):

```bash
node src/import-leads.js
```

O script lê cada linha e faz um `POST /leads` para cada entrada, exibindo o resultado no terminal.

## Estrutura do projeto

```
src/
├── server.js                   # entrada (HTTP server + Swagger UI)
├── routes.js                   # definição de todas as rotas
├── database.js                 # classe Database (queries PostgreSQL)
├── import-leads.js             # script de importação CSV
├── swagger.json                # spec OpenAPI 3.0
├── db.sql                      # migration da tabela leads
├── middlewares/
│   └── json.js                 # parse do body JSON
└── utils/
    ├── extract-query-params.js # parse da query string
    └── route-path.js           # helper para regex de rotas
```

## Comandos úteis

```bash
npm run dev     # inicia com nodemon (hot reload)
npm start       # inicia em produção
```

## Variáveis de ambiente

| Variável       | Descrição                          | Exemplo                                          |
|----------------|------------------------------------|--------------------------------------------------|
| `DATABASE_URL` | String de conexão PostgreSQL       | `postgresql://user:pass@localhost:5432/leads_db` |
| `PORT`         | Porta do servidor (padrão: `3333`) | `3333`                                           |
