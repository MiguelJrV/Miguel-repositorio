import React from 'react';
import TaskList from './components/taskList'; // Importa tu componente TaskList

const App = () => {
  return (
    <div>
      <h1>Gestor de Tareas</h1>
      <TaskList /> {/* Renderiza el componente TaskList */}
    </div>
  );
};

export default App;