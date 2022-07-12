import express from "express";
import sequelize from "./config/db.js";

import vetRoutes from './routes/vetRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
// Add Corss
import cors from 'cors';
import dotenv, { config } from 'dotenv';
/* dotenv.config()
console.log(process.env) */
const app = express();
// Allow json 
app.use(express.json())
const port = process.env.PORT || 4000;

process.env.TZ = 'America/Guayaquil' ;

new Date().toLocaleString();

// Cors Options
// const whiteList = ['http://localhost:4000'];
var whitelist =[process.env.FRONT_URL];
console.log(whitelist)
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


// Use Cors
app.use(cors(corsOptions))




// Define Routes
app.use('/api/vets', vetRoutes);
app.use('/api/patients', patientRoutes);

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');

   await sequelize.sync({ alter: true });
  console.log("All models were synchronized successfully."); 
} catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
}


app.listen(port, () => {
    console.log("Usando puerto", port)
})
