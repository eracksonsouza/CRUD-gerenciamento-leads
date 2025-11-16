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

    await fetch("http://localhost:3333/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });
  }
}

run()