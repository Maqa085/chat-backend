const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://musicbot:UJcqDF6ONi29nmMJ@music.0hxxbjw.mongodb.net/chatDB?retryWrites=true&w=majority";
mongoose.connect(mongoURI);

// Mesaj və İstifadəçi modelləri
const Message = mongoose.model('Message', {
    userId: Number,
    userName: String,
    text: String,
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', {
    userId: { type: Number, unique: true },
    userName: String,
    lastSeen: { type: Date, default: Date.now }
});

// Giriş edən istifadəçini qeyd etmək
app.post('/api/login', async (req, res) => {
    const { userId, userName } = req.body;
    await User.findOneAndUpdate(
        { userId }, 
        { userName, lastSeen: Date.now() }, 
        { upsert: true }
    );
    res.json({ success: true });
});

// Mesaj göndərmək
app.post('/api/send', async (req, res) => {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json({ success: true });
});

// Bütün mesajları gətirmək
app.get('/api/messages', async (req, res) => {
    const messages = await Message.find().sort({ date: 1 }).limit(100);
    res.json(messages);
});

app.listen(process.env.PORT || 3000);
