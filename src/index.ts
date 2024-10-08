import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials:true,
}));
 
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app)

server.listen(8080,()=>{
    console.log('Server running on 8080')
})

const MONGOSE_URL = 'mongodb+srv://chiraggowdam:2103%40chirag@cluster0.gx2aetw.mongodb.net/test1';
 mongoose.Promise = Promise;
 mongoose.connect(MONGOSE_URL);
 mongoose.connection.on('error',(error:Error)=>console.log(error));
 
app.use('/',router())