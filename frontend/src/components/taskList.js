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
    const interval = setInterval(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          // Reevaluar la categoría de la tarea en tiempo real
          return {
            ...task,
            category: categorizeTasks(task),
          };
        })
      );
    }, 5000); // Actualización cada segundo
  
    return () => clearInterval(interval); 
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
    const tasksToDelete = tasks.filter((task) => task.category === status);
    for (const task of tasksToDelete) {
      await deleteTask(task._id);
    }
  };

  const categorizeTasks = (task) => {
    const now = new Date();
    const taskDueDate = new Date(task.dueDate);
  
    // Si está completada, se clasifica como completada
    if (task.status === 'completed') return 'completed';
  
    // Si la fecha actual supera la fecha y hora de la tarea, se clasifica como expirada
    if (taskDueDate <= now) return 'expired';
  
    // Si no cumple con ninguna de las anteriores, está pendiente
    return 'pending';
  };
  

  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate).toDateString();
    const selected = selectedDate.toDateString();
    return taskDate === selected;
  });

  return (
    <div className="task-manager">
      <h1>Gestor de Tareas</h1>
  
      {/* Contenedor del calendario */}
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>
  
      {/* Contenedor de las tareas */}
      <div className="tasks-container">
        {['pending', 'completed'].map((status) => {
          const tasksToShow = filteredTasks.filter(
            (task) => task.category === status
          );
  
          return (
            <div key={status} className="task-section">
              {/* Encabezado de cada sección */}
              <div className="task-section-header">
                <h2>
                  {status === 'pending' && 'Pendientes'}
                  {status === 'completed' && 'Completadas'}
                </h2>
                {tasksToShow.length > 0 && (
                  <button
                    className="delete-all-btn"
                    onClick={() => deleteAllTasksInSection(status)}
                  >
                    Eliminar todas
                  </button>
                )}
              </div>
  
              {/* Lista de tareas */}
              {tasksToShow.length === 0 ? (
                <p className="no-tasks-message">
                  No se encontraron datos para la fecha seleccionada
                </p>
              ) : (
                <ul>
                  {tasksToShow.map((task) => (
                    <li key={task._id}>
                      <div className="task-item">
                        <span className="task-title">
                          {task.title} - {new Date(task.dueDate).toLocaleString()}
                        </span>
                        {task.description && (
                          <p className="task-description">
                            {task.description.length > 50
                              ? `${task.description.slice(0, 50)}...`
                              : task.description}
                          </p>
                        )}
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
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
  
        {/* Sección de tareas expiradas */}
        <div className="task-section">
          <div className="task-section-header">
            <h2>Expiradas</h2>
            {tasks.filter((task) => task.category === 'expired').length > 0 && (
              <button
                className="delete-all-btn"
                onClick={() => deleteAllTasksInSection('expired')}
              >
                Eliminar todas
              </button>
            )}
          </div>
  
          {/* Lista de tareas expiradas */}
          {tasks.filter((task) => task.category === 'expired').length === 0 ? (
            <p className="no-tasks-message">
              No hay tareas expiradas hasta el momento.
            </p>
          ) : (
            <ul>
              {tasks
                .filter((task) => task.category === 'expired')
                .map((task) => (
                  <li key={task._id} className="expired">
                    <span className="expired-text">
                      {task.title} - {new Date(task.dueDate).toLocaleString()}
                    
                    </span>
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
  
      {/* Contenedor para agregar tareas */}
      <div className="add-task">
        <h2>Agregar Tarea</h2>
        <input
          type="text"
          placeholder="Título"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <div
          className="datetime-input"
          onClick={() => document.getElementById("datetime-picker").showPicker()}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label>Fecha y Hora:</label>
          <input
            id="datetime-picker"
            type="datetime-local"
            value={
              newTask.dueDate
                ? `${newTask.dueDate.toISOString().split("T")[0]}T${newTask.dueDate
                    .toTimeString()
                    .slice(0, 5)}`
                : ""
            }
            onChange={(e) => {
              const [date, time] = e.target.value.split("T");
              setNewTask({
                ...newTask,
                dueDate: new Date(`${date}T${time}`),
              });
            }}
            min={new Date().toISOString().slice(0, 16)}
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
