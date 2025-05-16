const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// simpan data di memory
let todos = [];
let idCounter = 1;

// Helper Functions
const validateStatus = (status) => ["pending", "done"].includes(status);

// simpan todo ke dalam array
app.post("/todos", (req, res, next) => {
  const { title, status } = req.body;

  if (!title) return res.status(400).json({ success: false, message: "Title is required" });
  if (!validateStatus(status)) return res.status(400).json({ success: false, message: "Invalid status" });

  const todo = { id: idCounter++, title, status };
  todos.push(todo);
  res.status(201).json({ success: true, data: todo, message: "Todo created" });
});

// mendapatkan semua todo
app.get("/todos", (req, res) => {
  const { status } = req.query;

  let result = todos;
  if (status) {
    if (!validateStatus(status)) {
      return res.status(400).json({ success: false, message: "Invalid status filter" });
    }
    result = todos.filter((todo) => todo.status === status);
  }

  res.json({ success: true, data: result, message: "Todos fetched" });
});

// melakukan update status todo
app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!validateStatus(status)) return res.status(400).json({ success: false, message: "Invalid status" });

  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });

  todo.status = status;
  res.json({ success: true, data: todo, message: "Todo updated" });
});

// menghapus todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === parseInt(id));

  if (index === -1) return res.status(404).json({ success: false, message: "Todo not found" });

  const deleted = todos.splice(index, 1)[0];
  res.json({ success: true, data: deleted, message: "Todo deleted" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
