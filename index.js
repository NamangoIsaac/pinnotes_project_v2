const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/note');
const User = require('./models/user');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myapp', (error) => {
    if (error) {
        console.error('Connection error:', error);
    } else {
        console.log('Successfully Connected');
    }
});

// Serve static files (if needed)
// app.use(express.static('public'));

// HTML endpoints
app.get('/', (req, res) => {
    res.sendFile('pages/index.html', { root: __dirname });
});

app.get('/login', (req, res) => {
    res.sendFile('pages/login.html', { root: __dirname });
});

app.get('/signup', (req, res) => {
    res.sendFile('pages/signup.html', { root: __dirname });
});

// API endpoints
app.post('/getnotes', async (req, res) => {
    try {
        let notes = await Note.find({ email: req.body.email });
        res.status(200).json({ success: true, notes: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving notes', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne(req.body);
        if (!user) {
            res.status(200).json({ success: false, message: "No user found" });
        } else {
            res.status(200).json({ success: true, user: { email: user.email }, message: "User found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
});

app.post('/signup', async (req, res) => {
    try {
        let user = await User.create(req.body);
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error signing up', error: error.message });
    }
});

app.post('/addnote', async (req, res) => {
    try {
        let note = await Note.create(req.body);
        res.status(200).json({ success: true, note: note });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding note', error: error.message });
    }
});

app.post('/deletenote', async (req, res) => {
    const { noteId } = req.body;
    try {
        await Note.findByIdAndDelete(noteId);
        res.status(200).json({ success: true, message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting note', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
