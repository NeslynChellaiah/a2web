require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');

app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);

module.exports = app;
