const express = require('express');
const bodyParser = require("body-parser");
const app = express();

let task = [];
const rootUrl = '/api';

app.use(bodyParser.json());

app.get(`${rootUrl}/task`, (req, res) => { res.json(task); });

app.post(`${rootUrl}/task`, (req, res) => {
  const newTask = req.body.task;
  task = [];
  task.push(newTask);
  res.json(newTask);
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
