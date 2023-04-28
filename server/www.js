require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const app = express();

// Postgres Config
const {Pool} = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

let tasks = [];
const rootUrl = '/api';

app.use(bodyParser.json());

app.get(`${rootUrl}/task`, (req, res) => {
  ;(async () => {
    const {rows} = await pool.query('SELECT * FROM task');
    res.json(rows);
  })().catch(e => {
    console.error(e.stack);
    res.json({error: e.stack});
  })
});

app.post(`${rootUrl}/task`, (req, res) => {
  const newTasks = req.body;
  (async () => {
    const client = await pool.connect();
    try {
      for (const task of newTasks) {
          await client.query(
            `INSERT INTO public.task (title, content, iscomplete)
             VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id, title, content, iscomplete`,
            [task.title, task.content, task.taskComplete]);
      }
      tasks = [...tasks, ...newTasks];
      res.status(201).json(tasks);
    } finally {
      client.release();
    }
  })().catch(e => {
    res.json({error: e.stack});
  });
});

app.get(`${rootUrl}/status`, (req, res) => {
  res.json({info: 'Node.js, Express, and Postgres API'});
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Listen to the specified port, otherwise 3080
const PORT = process.env.PORT || 3080;
const server = app.listen(PORT, () => {
  console.log(`Server Running: http://localhost:${PORT}`);
});
/**
 * The SIGTERM signal is a generic signal used to cause program
 * termination. Unlike SIGKILL , this signal can be blocked,
 * handled, and ignored. It is the normal way to politely ask a
 * program to terminate. The shell command kill generates
 * SIGTERM by default.
 */
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server Close: Process Terminated!');
  });
});
