const express = require('express');
const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/tasksDB"; // practica necesaria por seguridad
const cors = require('cors');

const app = express();
const PORT = 5010;

app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => console.log("Conectado a MongoDB correctamente."));

// Rutas
app.get('/', (req, res) => {
    res.send("Servidor funcionando");
});

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
