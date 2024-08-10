import { pool } from "./database.js";

class LibrosController {
  // Método para obtener todos los libros
  async getAll(req, res) {
    try {
      const [result] = await pool.query("SELECT * FROM libros");

      res.json(result);
    } catch (error) {
      console.error("Error al obtener los libros:", error.message);
      res.status(500).json({ error: "Error al obtener los libros" });
    }
  }

  // Método para obtener un libro por ID
  async getOne(req, res) {
    const { id } = req.params;

    try {
      const [rows] = await pool.query("SELECT * FROM libros WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error("Error al obtener el libro:", error.message);
      res.status(500).json({ error: "Error al obtener el libro" });
    }
  }

  // Método para crear un nuevo libro
  async create(req, res) {
    const { nombre, autor, categoria, año_publicacion, ISBN } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!nombre || !autor || !categoria || !año_publicacion || !ISBN) {
      return res.status(400).json({ error: "Todos los campos son necesarios" });
    }
    try {
      const [result] = await pool.query(
        "INSERT INTO libros (nombre, autor, categoria, año_publicacion, ISBN) VALUES (?, ?, ?, ?, ?)",
        [nombre, autor, categoria, año_publicacion, ISBN]
      );

      const newBookId = result.insertId;

      res.status(201).json({
        id: newBookId,
        nombre,
        autor,
        categoria,
        año_publicacion,
        ISBN,
        message: "Libro creado exitosamente",
      });
    } catch (error) {
      console.error("Error al crear el libro:", error.message);

      res.status(500).json({ error: "Error al crear el libro" });
    }
  }

  // Método para actualizar un libro existente
  async update(req, res) {
    const { id } = req.params;
    const updates = req.body;

    console.log("Datos recibidos para actualización:", updates);

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar al menos un campo para actualizar" });
    }

    try {
      const updateFields = [];
      const updateValues = [];

      for (const [key, value] of Object.entries(updates)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }

      updateValues.push(id);

      const query = `UPDATE libros SET ${updateFields.join(", ")} WHERE id = ?`;

      const [result] = await pool.query(query, updateValues);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.json({
        id,
        ...updates,
        message: "Libro actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error al actualizar el libro:", error.message);
      res.status(500).json({ error: "Error al actualizar el libro" });
    }
  }

  // Método para eliminar un libro por ISBN
  async delete(req, res) {
    const { ISBN } = req.params;

    console.log("ISBN recibido para eliminación:", ISBN);

    try {
      const [result] = await pool.query("DELETE FROM libros WHERE ISBN = ?", [
        ISBN,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.json({
        ISBN,
        message: "Libro eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar el libro:", error.message);
      res.status(500).json({ error: "Error al eliminar el libro" });
    }
  }
}

export const libro = new LibrosController();
