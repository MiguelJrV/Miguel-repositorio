# Gestor de Tareas 📝
Un proyecto desarrollado con React, Node.js, MongoDB y Docker para gestionar tareas, permitiendo organizarlas por estado (pendientes, completadas, expiradas) y con filtrado por fechas.

## Índice
- Características
- Tecnologías Utilizadas
- Requisitos Previos
- Configuración del Proyecto
- Uso del Proyecto
- Estructura del Proyecto
- Contribuir
- Licencia

## Características
- Interfaz para agregar, eliminar y completar tareas.
- Clasificación de tareas: Pendientes, Completadas, y Expiradas.
- Filtrado de tareas según la fecha seleccionada en un calendario interactivo.
- Persistencia de datos mediante **MongoDB.**
- Funciona en contenedores Docker, garantizando portabilidad y facilidad de configuración.

## Tecnologías Utilizadas
- **Frontend:** React + React Calendar
- **Backend:** Node.js + Express.js
- **Base de Datos:** MongoDB
- **Docker:** Para contenerización del proyecto

## Requisitos Previos
Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Docker Desktop (indispensable)](https://www.docker.com/products/docker-desktop)
- **Navegador Web** (Chrome, Firefox, Edge, etc.).

## Configuración del Proyecto

1. **Clonar el Repositorio**  
   Ejecuta el siguiente comando en tu terminal:

   ```bash
   git clone https://github.com/MiguelJrV/task-manager
   cd task-manager
   ```
2. **Construir los Contenedores**  
   Para construir las imágenes de Docker, ejecuta:
   ```bash
    docker-compose --build
    ```
3. **Iniciar el Proyecto**  
   Para ejecutar los contenedores en segundo plano:
   ```bash
   docker-compose up -d
   ```
4. **Verificar los Servicios**
- Frontend: http://localhost:3000
- Backend: http://localhost:5010
- MongoDB: http://localhost:27017
*(Nota: Puedes cambiar los puertos en el archivo docker-compose.yml si los tienes ocupados.)*

## Uso del Proyecto
1. **Agregar Tareas**
- Completa los campos de **Título, Descripción,** y selecciona una fecha y hora.
- Haz clic en el botón **"Agregar"** para guardar la tarea.
2. **Visualizar Tareas**
- Usa el calendario para seleccionar una fecha específica.
- Filtra tareas **pendientes y completadas** según la fecha seleccionada.
- Las tareas **expiradas** (no completadas en la fecha asignada) siempre estarán visibles en la sección **"Expiradas".**
3. **Gestionar Tareas**
- **Completar tarea:** Haz clic en el botón **"Completar"** junto a la tarea pendiente.
- **Eliminar tarea:** Haz clic en el botón **"Eliminar"** para borrar una tarea específica.
- **Eliminar todas las tareas de una sección:** Usa el botón **"Eliminar todas"** en la cabecera de cada categoría.

### Autor
**Miguel Venegas**  
Desarrollador apasionado por crear soluciones con tecnología.

¿Dudas o sugerencias? Contáctame a mi correo Angesdesneiges@gmail.com.