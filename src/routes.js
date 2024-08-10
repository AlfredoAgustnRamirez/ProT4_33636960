import { Router } from 'express';
import { libro } from './controller.js';

export const router = Router()

// Ruta para obtener todos los libros
router.get('/libros', libro.getAll);

// Ruta para obtener un libro específico por ID
router.get('/libros/:id', libro.getOne);

// Ruta para crear un nuevo libro
router.post('/create', libro.create);

// Ruta para actualizar un libro por ID
router.put('/update/:id', libro.update);

// Ruta para eliminar un libro por ISBN
router.delete('/delete/:ISBN', libro.delete);

