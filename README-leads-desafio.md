# 🚀 Desafio: API de Gerenciamento de Leads de Marketing

Nesse desafio você irá desenvolver uma **API em Node.js** para realizar o gerenciamento completo de **leads de marketing** (CRUD), com:

- Criação de leads  
- Listagem com filtros  
- Atualização  
- Remoção  
- Marcação de leads como **contatados**  

O principal diferencial do projeto é a implementação de uma **rotina de importação de leads em massa** a partir de um arquivo CSV, utilizando a biblioteca [`csv-parse`](https://csv.js.org/parse/).

> O foco é praticar **CRUD** e **manipulação de arquivos/streams**, mantendo a mesma dificuldade do desafio clássico de Todo List.

---

## ✅ Objetivos do desafio

- Criar uma API REST em Node.js (sem framework obrigatório — você pode usar apenas `http` nativo, se quiser).
- Implementar as operações básicas de CRUD para a entidade **Lead**.
- Permitir **filtros na listagem**.
- Implementar uma **rota para marcar/desmarcar lead como contatado**.
- Criar um **script separado** para importar leads em massa via CSV, usando `csv-parse` com iterador assíncrono (`for await`).

---

## 🧱 Estrutura de um Lead

Cada lead deve ser composto pelas seguintes propriedades:

- `id`: identificador único do lead
- `name`: nome do lead
- `email`: e-mail do lead
- `contacted_at`: data/hora em que o lead foi contatado  
  - Deve iniciar como `null`
- `created_at`: data/hora de criação do lead
- `updated_at`: data/hora da última atualização do lead  
  - Deve ser alterada sempre que o lead for modificado

> Você é livre para escolher como gerar o `id` (UUID, incremento, etc.).

---

## 🌐 Rotas da API

### 1) `POST /leads`

Cria um novo lead.

**Request body (JSON):**

```json
{
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Regras:**

- Os campos `name` e `email` devem ser recebidos no body da requisição.
- Os campos `id`, `created_at`, `updated_at` e `contacted_at` devem ser preenchidos automaticamente:
  - `contacted_at` deve iniciar como `null`.

---

### 2) `GET /leads`

Lista todos os leads existentes.

**Regras:**

- Deve permitir a busca por leads filtrando pelos campos:
  - `name`
  - `email`

Você pode implementar a filtragem via **query params**, por exemplo:

- `GET /leads?name=joao`
- `GET /leads?email=@example.com`

A listagem deve retornar todos os leads, ou apenas os que combinam com os filtros (se enviados).

---

### 3) `PUT /leads/:id`

Atualiza um lead específico.

**Request body (JSON):**

```json
{
  "name": "João da Silva",
  "email": "joaodasilva@example.com"
}
```

**Regras:**

- Deve receber `name` e/ou `email` no corpo da requisição.
- Antes de atualizar, deve validar se o `id` fornecido corresponde a um lead existente.
- Sempre que um lead for atualizado, o campo `updated_at` deve ser modificado.

---

### 4) `DELETE /leads/:id`

Remove um lead específico.

**Regras:**

- Antes de remover, deve validar se o `id` fornecido corresponde a um lead existente.
- Caso o `id` não exista, retornar uma resposta adequada informando que o lead não foi encontrado.

---

### 5) `PATCH /leads/:id/contact`

Altera o status de contato do lead, modificando o campo `contacted_at`.

**Regras:**

- Antes de alterar, deve validar se o `id` fornecido corresponde a um lead existente.
- Comportamento esperado:
  - Se `contacted_at` for `null` → definir `contacted_at` com a **data/hora atual** (marcar como contatado).
  - Se `contacted_at` já tiver um valor → voltar para `null` (marcar como **não contatado**).
- Sempre que houver alteração, atualizar o campo `updated_at`.

---

## 📥 Importação de Leads via CSV

A importação de leads em massa **não precisa ser feita por rota HTTP**.  
Em vez disso, você deve criar um **arquivo de script separado**, por exemplo:

- `import-csv.js`

Esse script será responsável por:

1. Ler um arquivo CSV contendo os dados de leads.
2. Para cada linha:
   - Enviar uma requisição HTTP para a rota `POST /leads` da sua API, passando os campos necessários.

### 📦 Biblioteca obrigatória

Use a biblioteca [`csv-parse`](https://csv.js.org/parse/) e implemente a leitura do CSV utilizando o **iterador assíncrono** (padrão `for await (...)`), semelhante ao uso de streams visto em aula.

### 🗂️ Formato recomendado do CSV

Crie um arquivo, por exemplo, `leads.csv`, com o conteúdo no formato:

```csv
name,email
João Silva,joao@example.com
Maria Souza,maria@example.com
Pedro Costa,pedro@example.com
Ana Lima,ana@example.com
Carlos Nunes,carlos@example.com
```

**Regras para o script de importação:**

- Ler o arquivo CSV.
- Pular a **primeira linha** (cabeçalho).
- Para cada linha, montar um objeto com `name` e `email`.
- Fazer uma requisição HTTP para `POST /leads`.

---

## 🛠️ Requisitos técnicos

Sugestão (não obrigatório, mas recomendado):

- Node.js 18+  
- Gerenciador de pacotes: `npm`, `yarn` ou `pnpm`
- Biblioteca para CSV:
  - `csv-parse`

Exemplo de instalação:

```bash
npm install csv-parse
```

---

## ▶️ Sugestão de fluxo para rodar o projeto

> **Obs.:** Essa parte é apenas um guia geral, você pode adaptar conforme sua organização de pastas.

1. Instalar dependências:

```bash
npm install
```

2. Rodar o servidor da API:

```bash
npm run dev
# ou
node src/server.js
```

3. Em outro terminal, rodar o script de importação:

```bash
node import-csv.js
```

Certifique-se de que:

- A API está rodando (por exemplo, em `http://localhost:3333`).
- O script `import-csv.js` está configurado para fazer requisições para o endereço correto.

---

## 💡 Indo além (opcional)

Se quiser deixar o desafio um pouco mais completo, sem alterar muito a dificuldade, você pode:

- Validar se as propriedades `name` e `email` estão presentes nas rotas `POST` e `PUT`.
- Nas rotas que recebem `/:id`, além de validar se o `id` existe, retornar uma mensagem clara em caso de erro, por exemplo:

```json
{
  "message": "Lead não encontrado."
}
```

- Implementar uma validação simples de e-mail (ex.: checar se contém `"@"`).

---

## 🎯 Critério de conclusão

Você conclui o desafio quando:

- Todas as rotas (`POST`, `GET`, `PUT`, `DELETE`, `PATCH`) estiverem implementadas e funcionando.
- A entidade **Lead** respeitar a estrutura definida.
- O script de importação estiver lendo o CSV e criando os leads na API usando a lib `csv-parse` com iterador assíncrono.
- Os filtros de listagem (`GET /leads`) estiverem funcionando para `name` e `email`.

---

Bom código! 💻  
Esse desafio simula bem algo que você poderia usar num **painel de marketing real**, mas com a mesma complexidade do clássico “todo list”. 😉
