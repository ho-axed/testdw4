import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a MongoDB utilizando Mongoose
const DB = process.env.DB;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});

// Definición del esquema y modelo de productos
const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
});
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  edad: Number,
  correo: String,
});

const Producto = mongoose.model('Producto', productoSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Operación para obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error al obtener usuarios');
  }
});
// Operación para agregar un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const nuevoProducto = new Producto({ nombre, precio, descripcion });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).send('Error al agregar producto');
  }
});
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, edad, correo } = req.body;
    const nuevoUsuario = new Usuario({ nombre, edad, correo });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).send('Error al agregar usuario');
  }
});

// Operación para actualizar un producto por ID
app.put('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const productoActualizado = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID no válido');
    }

    const resultado = await Producto.findByIdAndUpdate(id, productoActualizado, { new: true });

    if (!resultado) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).json(resultado);
  } catch (er) {
    console.error('Error al actualizar el producto:', er);
    res.status(500).send('Error al actualizar el producto');
  }
});
app.put('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const usuarioActualizado = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID no válido');
    }

    const resultado = await Usuario.findByIdAndUpdate(id, usuarioActualizado, { new: true });

    if (!resultado) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.status(200).json(resultado);
  } catch (er) {
    console.error('Error al actualizar el usuario:', er);
    res.status(500).send('Error al actualizar el usuario');
  }
});

// Operación para eliminar un producto por ID
app.delete('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID no válido');
    }

    const resultado = await Producto.findByIdAndDelete(id);

    if (!resultado) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).send('Producto eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error al eliminar el producto');
  }
});
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID no válido');
    }

    const resultado = await Usuario.findByIdAndDelete(id);

    if (!resultado) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.status(200).send('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error al eliminar el usuario');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
