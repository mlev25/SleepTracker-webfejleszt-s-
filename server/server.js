const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Import routes
const authRoutes = require('./routes/authRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const dreamRoutes = require('./routes/dreamRoutes');
const userRoutes = require('./routes/userRoutes');

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

mongoose.set('strictQuery', true);
mongoose.connection.on('connected', () => {
    mongoose.model('SleepSession').createIndexes() 
        .then(() => console.log('MongoDB: SleepSession indexek frissítve.'))
        .catch(err => console.error('MongoDB Index Hiba:', err.message));
});

//connect routes
app.use('/api/auth', authRoutes);
app.use('/api/sleepsessions', sleepRoutes);
app.use('/api/dreamlogs', dreamRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port  http://localhost:${PORT}`);
});