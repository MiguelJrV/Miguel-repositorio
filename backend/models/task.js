const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio']
  },
  description: String,
  dueDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendiente', 'completada', 'expirada'],
    default: 'pendiente'
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

