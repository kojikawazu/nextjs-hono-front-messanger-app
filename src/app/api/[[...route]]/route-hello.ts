import { Hono } from 'hono';
// import { Client } from "pg";

const hello = new Hono();

// /** DBへ接続する */
// const client = new Client({
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: parseInt(process.env.PG_PORT || "5432", 10),
// });
  
// client.connect();

// hello.get('/', async (c) => {
//     const res = await client.query("SELECT NOW()");
//     return c.json({ message: `Hello from Hono! Current time is: ${res.rows[0].now}` });
// });

export default hello;