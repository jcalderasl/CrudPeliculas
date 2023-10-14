// Importa las dependencias necesarias.
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Importa CORS.

// Habilita CORS.
app.use(cors());

// URL de conexión a la base de datos MongoDB.
const url = 'mongodb://127.0.0.1:27017/GestionPeliculas_db';

// Conecta a la base de datos MongoDB.
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos')) // Imprime un mensaje si la conexión es exitosa.
.catch((e) => console.log('Error de conexión:' + e)); // Maneja errores de conexión.

// Define el esquema de la película utilizando Mongoose.
const peliculaSchema = mongoose.Schema({
    title: String,      // Título de la película.
    director: String,   // Director de la película.
    releaseDate: Date,  // Fecha de estreno de la película.
    genre: String,      // Género de la película.
    duration: Number,   // Duración de la película en minutos.
    rating: Number     // Puntuación de la película.
}, { versionKey: false }); // Evita la generación de un campo "__v" en los documentos.

// Crea un modelo a partir del esquema, que se utilizará para interactuar con la base de datos.
const PeliculaModel = mongoose.model('Peliculas', peliculaSchema);

// Configura el servidor Express.
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'.
app.use(express.json()); // Permite recibir datos JSON en las solicitudes POST.

// Define una ruta para obtener la lista de películas.
app.get('/peliculas', async (req, res) => {
    const peliculas = await PeliculaModel.find(); // Busca todas las películas en la base de datos.
    res.json(peliculas); // Devuelve la lista de películas en formato JSON.
});

// Define una ruta para agregar una nueva película.
app.post('/peliculas', async (req, res) => {
    const pelicula = new PeliculaModel(req.body); // Crea una nueva instancia de PeliculaModel con los datos recibidos.
    const result = await pelicula.save(); // Guarda la película en la base de datos.
    res.json(result); // Devuelve la película creada en formato JSON.
});

// Define una ruta para actualizar una película existente.
app.put('/peliculas/:id', async (req, res) => {
    try {
        const pelicula = await PeliculaModel.findOneAndUpdate(
            { _id: req.params.id }, // Encuentra la película por su ID.
            req.body, // Actualiza la película con los datos recibidos.
            { new: true } // Devuelve la película actualizada.
        );
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.json(pelicula); // Devuelve la película actualizada en formato JSON.
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la película' });
    }
});

// Define una ruta para eliminar una película existente.
app.delete('/peliculas/:id', async (req, res) => {
    try {
        const pelicula = await PeliculaModel.findByIdAndDelete(req.params.id); // Encuentra la película por su ID y la elimina.
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.json({ message: 'Película eliminada exitosamente' }); // Devuelve un mensaje de éxito.
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la película' });
    }
});

// Inicia el servidor y lo hace escuchar en el puerto 3000.
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
