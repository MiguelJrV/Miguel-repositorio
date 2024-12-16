const express = require('express');
const Task = require('../models/task');
const router = express.Router();

// Crear una nueva tarea
router.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const task = new Task({ title, description, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea', error });
  }
});

// Obtener todas las tareas
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas', error });
  }
});

// Marcar una tarea como completada
router.patch('/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error });
  }
});

// Eliminar una tarea
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
});

module.exports = router;
