import fs from "node:fs";
import { parse } from "csv-parse";

const csvPath = new URL("../leads.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParser = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLine: 2,
});

async function run() {
  const linesParse = stream.pipe(csvParser);

  for await (const line of linesParse) {
    const [name, email] = line;

    try {
      const response = await fetch("http://localhost:3333/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (response.ok) {
        console.log(`✅ Lead criado: ${name}`);
      } else {
        console.log(`❌ Erro ao criar lead: ${name}`);
      }
    } catch (error) {
      console.log(`❌ Erro na requisição: ${error.message}`);
    }
  }

  console.log("🎉 Importação concluída!");
}

run();
