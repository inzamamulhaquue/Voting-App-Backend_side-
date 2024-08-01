const express = require('express');
const app = express();
require('dotenv').config();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const connectDatabase = require('./db');
connectDatabase();

const port = process.env.port || 6006;

const userRoutes = require('./routes/userRoute');
const candidateRoutes = require('./routes/candidateRoute');

// use route
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(port, () =>{
    console.log(`server is running on https://localhost:${port}`);
});