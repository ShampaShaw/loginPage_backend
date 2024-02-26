// Code to start the server and connect to the database
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

app.use(cors());
dotenv.config();


const PORT = process.env.PORT ;

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {

            
        });
        console.log(`Connected to MongoDB successfully! 🎉 ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

connectToDatabase();

app.use(express.json());
app.use('/api/auth', require('./src/route/auth'));
app.use('/protected', require('./src/route/protected'));


app.get("/", (req, res) => {   
  res.send("Welcome to Login Page!");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
