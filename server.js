const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');
const path = require('path');
const mongoose = require('mongoose');
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
// import { flogRoutes } from './routes/blog';
require('dotenv').config();

//app
const app = express();

//mongodb
mongoose
    .connect(process.env.DATABASE_CLOUD, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected'));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//cors
if(process.env.NODE_ENV === 'development'){
    app.use(cors({origin: `${process.env.CLIENT_URL}`}));
}
//routes middleware
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);

//routes
/*app.get('/api', (req, res)=>{
    res.json({time: Date().toString()});
});*/

//Serve static assets if in production
if(process.env.NODE_ENV == 'production'){
    //set static folder
    //app.use(express.static('frontend/build'));
    
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
    });
}
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log("Server listening on port, ", port)
});


