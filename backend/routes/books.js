const express = require('express');
const router = express.Router();

// Buscar libros
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar libros' });
  }
});

// Obtener detalles de un libro
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://openlibrary.org/works/${id}.json`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener detalles del libro' });
  }
});

module.exports = router;