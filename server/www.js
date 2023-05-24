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
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

let tasks = [];
const rootUrl = '/api';

app.use(bodyParser.json());
app.use('/', express.static('../client/dist/todo-app'));

app.get(`${rootUrl}/task`, (req, res) => {
  ;(async () => {
    const {rows} = await pool.query('SELECT * FROM task ORDER BY id ASC');
    res.json(rows);
  })().catch(e => {
    console.error(e.stack);
    res.json({error: e.stack});
  })
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

app.get(`${rootUrl}/task/user/:user_id`, (req, res) => {
  const user_id = req.params.user_id;
  (async () => {
    const {rows} = await pool.query('SELECT * FROM task WHERE user_id = $1', [user_id]);
    res.json(rows);
  })().catch(e => {
    console.error(e.stack);
    res.json({error: e.stack});
  })
});
app.get(`${rootUrl}/task/user/:user_id/complete`, (req, res) => {
  const user_id = req.params.user_id;
  (async () => {
    const {rows} = await pool.query('SELECT * FROM task WHERE user_id = $1 AND is_complete = true', [user_id]);
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
      for (const {title, content, is_complete, user_id} of newTasks) {
        await client.query(
          `INSERT INTO public.task (title, content, is_complete, user_id)
           VALUES ($1, $2, $3, $4) ON CONFLICT (title, content) DO NOTHING RETURNING id, title, content, is_complete, user_id`,
          [title, content, is_complete, user_id]);

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

app.patch(`${rootUrl}/task/:task_id`, (req, res) => {
  const id = parseInt(req.params.task_id);
  const isComplete = req.body.is_complete;
  (async () => {
    const client = await pool.connect();
    try {
      const {rows} = await client.query(
        `UPDATE public.task
         SET is_complete = $1
         WHERE id = $2 RETURNING id, title, content, is_complete, user_id`,
        [isComplete, id]);
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
          tasks[i].is_complete = isComplete;
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

app.delete(`${rootUrl}/task/:task_id`, (req, res) => {
  const id = parseInt(req.params.task_id);
  (async () => {
    const client = await pool.connect();
    try {
      const {rows} = await client.query(
        `DELETE
         FROM public.task
         WHERE id = $1 returning id, title, content, is_complete, user_id`,
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
  console.log(`Server Running: http://3.15.149.3:${PORT}`);
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
