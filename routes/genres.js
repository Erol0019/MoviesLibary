const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  });
  
  router.post('/', async (req, res) => {
      const result = validate(req.body);
      if (result.error) {
          res.status(400).send(result.error.details[0].message);
          return;
      }
  
    let genre = new Genre({
      name: req.body.name
    });
    genre = await genre.save();
    res.send(genre);
  });
  
  router.get('/:id', async (req, res) => {
    const genre = await Genre.findById();

    if(!genre) {
      res.status(404).send('The genre was not fount');
      return;
      }
    res.send(genre);
  });
  
  router.put('/:id', async (req, res) => {
    const result = validate(req.body);
      if (result.error) {
          res.status(400).send(result.error.details[0].message);
          return;
      }
        
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { 
        new: true 
    });

      if(!genre) { 
          res.status(404).send('The genre was not fount')
          return;
      }

      res.send(genre);
  });
  
  
  router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if(!genre) {
          res.status(404).send('The genre was not fount');
          return;
      }
      res.send(genre);
  });
  
  module.exports = router;