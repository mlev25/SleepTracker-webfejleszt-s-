const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port  http://localhost:${PORT}`);
});
//const cors = require('cors');
//const authRoutes = require('./routes/auth');
//const sleepRoutes = require('./routes/sleep');