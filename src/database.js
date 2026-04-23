import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export class Database {
  async select(table, search) {
    if (search) {
      const entries = Object.entries(search);
      const conditions = entries.map(([key], i) => `${key} ILIKE $${i + 1}`);
      const values = entries.map(([, value]) => `%${value}%`);
      const { rows } = await pool.query(
        `SELECT * FROM ${table} WHERE ${conditions.join(" OR ")}`,
        values
      );
      return rows;
    }

    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    return rows;
  }

  async findById(table, id) {
    const { rows } = await pool.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );
    return rows[0] ?? null;
  }

  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const { rows } = await pool.query(
      `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`,
      values
    );
    return rows[0];
  }

  async update(table, id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`);
    await pool.query(
      `UPDATE ${table} SET ${setClause.join(", ")} WHERE id = $${keys.length + 1}`,
      [...values, id]
    );
  }

  async delete(table, id) {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  }
}
