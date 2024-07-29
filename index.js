require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const PORT = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON which is recieved from cliend in string format

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database Connected!");
}

const taskSchema = new Schema({
  title: { type: String, required: true },
  status: { type: Boolean, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const Task = mongoose.model("Task", taskSchema); // Task Model to create new  Collection`tasks` in MongoDB

// Create
app.post("/tasks", async function (req, res) {
  try {
    let task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All Tasks
app.get("/tasks", async function (req, res) {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Task by Name
app.get("/task/:name", async function (req, res) {
  try {
    const name = req.params.name;
    const findTaskByName = await Task.findOne({ title: name });
    if (!findTaskByName) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(findTaskByName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task by ID
app.patch("/task/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const UpdatedTask = await Task.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!UpdatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(UpdatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete Task By ID
app.delete("/task/:id", async function (req, res) {
  try {
    const id = req.params.id;
    await Task.findOneAndDelete({ _id: id });
    res.status(200).json("Task deleted");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
// username:murtazashabbir14@gmail.com
// password:
//1oMZkPsRxNQ96wOm
