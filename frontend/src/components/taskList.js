import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './taskList.css';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
  });

  // Obtener tareas del backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5010/api/tasks');
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
      const response = await axios.post('http://localhost:5010/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: new Date() });
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.patch(`http://localhost:5010/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Error al completar tarea:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5010/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const deleteAllTasksInSection = async (status) => {
    const tasksToDelete = tasks.filter((task) => categorizeTasks(task) === status);
    for (const task of tasksToDelete) {
      await deleteTask(task._id);
    }
  };

  const categorizeTasks = (task) => {
    const now = new Date();
    const taskDueDate = new Date(task.dueDate);
    if (task.status === 'completed') return 'completed';
    if (taskDueDate < now && task.status !== 'completed') return 'expired';
    return 'pending';
  };

  // Función para formatear la fecha y hora en 12H
  const formatDateTo12H = (date) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(date).toLocaleString('es-ES', options); // AM/PM en español
  };


  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate).toDateString();
    const selected = selectedDate.toDateString();
    return taskDate === selected;
  });

  return (
    <div className="task-manager">
      <h1>Gestor de Tareas</h1>
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <div className="tasks-container">
        {['pending', 'completed'].map((status) => {
          const tasksToShow = filteredTasks.filter(
            (task) => categorizeTasks(task) === status
          );

          return (
            <div key={status} className="task-section">
              <h2>
                {status === 'pending' && 'Pendientes'}
                {status === 'completed' && 'Completadas'}
              </h2>

              {tasksToShow.length === 0 ? (
                <p className="no-tasks-message">No se encontraron datos para la fecha seleccionada</p>
              ) : (
                <ul>
                  {tasksToShow.map((task) => (
                    <li key={task._id}>
                      <span>{task.title} - {new Date(task.dueDate).toLocaleString()}</span>
                      <div>
                        {status === 'pending' && (
                          <button
                            className="complete-btn"
                            onClick={() => markAsCompleted(task._id)}
                          >
                            Completar
                          </button>
                        )}
                        <button
                          className="delete-btn"
                          onClick={() => deleteTask(task._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        {/* Tareas expiradas siempre visibles */}
        <div className="task-section">
          <h2>Expiradas</h2>
          {tasks.filter((task) => categorizeTasks(task) === 'expired').length === 0 ? (
            <p className="no-tasks-message">No hay tareas expiradas hasta el momento.</p>
          ) : (
            <ul>
              {tasks
                .filter((task) => categorizeTasks(task) === 'expired')
                .map((task) => (
                  <li key={task._id} className="expired">
                    {/* Solo el texto de la tarea se tachará */}
                    <span className="expired-text">
                      {task.title} - {new Date(task.dueDate).toLocaleString()}
                    </span>
                    {/* Botón de eliminar que no se ve afectado */}
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      <div className="add-task">
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
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <div className="datetime-input">
          <label>Fecha:</label>
          <input
            type="date"
            value={newTask.dueDate.toISOString().split('T')[0]} // Solo fecha
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: new Date(`${e.target.value}T${newTask.dueDate.toISOString().split('T')[1]}`) })
            }
          />

          <label>Hora (Formato de 24h):</label>
          <input
            type="time"
            value={newTask.dueDate.toISOString().split('T')[1].slice(0, 5)} // Solo hora
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: new Date(`${newTask.dueDate.toISOString().split('T')[0]}T${e.target.value}`) })
            }
          />
        </div>
        <button onClick={addTask} className="add-btn">
          Agregar
        </button>
      </div>
    </div>
  );
};

export default TaskList;
