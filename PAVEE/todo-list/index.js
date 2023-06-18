const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

// อ่านข้อมูล Todo list ทั้งหมด
app.get('/todos', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json'));
  const todos = data.todos;
  res.json(todos);
});

// เพิ่ม Todo
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  const data = JSON.parse(fs.readFileSync('data.json'));
  const todos = data.todos;
  todos.push(newTodo);
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.status(201).json(newTodo);
});

// แก้ไข Todo
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const updatedTodo = req.body;
  const data = JSON.parse(fs.readFileSync('data.json'));
  const todos = data.todos;
  const index = todos.findIndex(todo => todo.id === todoId);
  if (index !== -1) {
    todos[index] = updatedTodo;
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.json(updatedTodo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// ลบ Todo
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const data = JSON.parse(fs.readFileSync('data.json'));
  const todos = data.todos;
  const index = todos.findIndex(todo => todo.id === todoId);
  if (index !== -1) {
    todos.splice(index, 1);
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.json({ message: 'Todo deleted' });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// เรียงลำดับ Todo list ตามพยัญชนะตัวอักษร
function sortTodosAlphabetically() {
  const data = JSON.parse(fs.readFileSync('data.json'));
  const todos = data.todos;
  todos.sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync('data.json', JSON.stringify(data));
}

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
