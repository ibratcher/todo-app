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
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

let tasks = [];
const rootUrl = '/api';

app.use(bodyParser.json());

app.get(`${rootUrl}/task`, (req, res) => {
  ;(async () => {
    const {rows} = await pool.query('SELECT * FROM task ORDER BY id ASC');
    res.json(rows);
  })().catch(e => {
    console.error(e.stack);
    res.json({error: e.stack});
  })
});

app.get(`${rootUrl}/task/complete`, (req, res) => {
  ;(async () => {
    const {rows} = await pool.query('SELECT * FROM task WHERE iscomplete = true ORDER BY id ASC');
    res.json(rows);
  })().catch(e => {
    console.error(e.stack);
    res.error({error: e.stack});
  });
});

app.get(`${rootUrl}/task/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  (async () => {
    const {rows} = await pool.query('SELECT * FROM task WHERE id = $1', [id]);
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
      for (const {title, content, iscomplete} of newTasks) {
        await client.query(
          `INSERT INTO public.task (title, content, iscomplete)
           VALUES ($1, $2, $3) ON CONFLICT (title, content) DO NOTHING RETURNING id, title, content, iscomplete`,
          [title, content, iscomplete]);

      }
      tasks = [...newTasks];
      res.status(201).json(tasks);
    } finally {
      client.release();
    }
  })().catch(e => {
    res.json({error: e.stack});
  });
});

app.patch(`${rootUrl}/task/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  const isComplete = req.body.iscomplete;
  (async () => {
    const client = await pool.connect();
    try {
      const {rows} = await client.query(
        `UPDATE public.task
         SET iscomplete = $1
         WHERE id = $2 RETURNING id, title, content, iscomplete`,
        [isComplete, id]);
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
          tasks[i].iscomplete = isComplete;
          break;
        }
      }
      res.status(200).json(rows);
    } finally {
      client.release();
    }
  })().catch(e => {
    res.json({error: e.stack});
  })
});

app.delete(`${rootUrl}/task/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  (async () => {
    const client = await pool.connect();
    try {
      const {rows} = await client.query(
        `DELETE
         FROM public.task
         WHERE id = $1 returning id, title, content, iscomplete`,
        [id]);
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
          tasks.splice(i, 1);
          break;
        }
      }
      res.status(200).json(rows);
    } finally {
      client.release();
    }
  })().catch(e => {
    res.json({error: e.stack});
  })
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
