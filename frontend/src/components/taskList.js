import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: new Date() });

  // Obtener tareas del backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://backend:5010/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
  
    try {
      const response = await axios.post('http://backend:5010/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: new Date() });
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://backend:5010/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Error al completar tarea:', error);
    }
  };

  return (
    <div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />

      <h2>Tareas</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.status}
            <button onClick={() => markAsCompleted(task._id)}>Completar</button>
          </li>
        ))}
      </ul>

      <h2>Agregar Tarea</h2>
      <input
        type="text"
        placeholder="Título"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <textarea
        placeholder="Descripción"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <button onClick={addTask}>Agregar</button>
    </div>
  );
};

export default TaskList;
