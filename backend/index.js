import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import crypto from 'crypto';
import resourceRoutes from './routes/resource.routes.js';
import morganMiddleware from './middleware/morganMiddleware.js';
import logRoutes from './routes/log.routes.js';
import { connectDB } from './db/connectDB.js';
import responseTime from 'response-time';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const sessionSecret = crypto.randomBytes(64).toString('hex');


app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // allows us to make requests from the frontend

app.use(express.json()); // allows us to parse incoming json data

app.use(cookieParser()); // allows us to parse cookies

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session())
app.use(morganMiddleware); // Apply Morgan middleware
app.use(responseTime());


app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes); // Use the resource routes
app.use('/api/logs', logRoutes);



app.listen(PORT, () => {
  connectDB();
  console.log('Server is running on http://localhost:5000');
});

//VmcfMAh538oz0ibu

/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://charindu15:VmcfMAh538oz0ibu@cluster0.z1kfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/