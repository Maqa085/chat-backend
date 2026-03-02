const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Sənin MongoDB linkin
const mongoURI = "mongodb+srv://musicbot:UJcqDF6ONi29nmMJ@music.0hxxbjw.mongodb.net/chatDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI).then(() => console.log("DB OK"));

const Message = mongoose.model('Message', {
    user: String,
    text: String,
    date: { type: Date, default: Date.now }
});

app.post('/send', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.send({ success: true });
    } catch (e) { res.status(500).send(e); }
});

app.get('/messages', async (req, res) => {
    const messages = await Message.find().sort({ date: -1 });
    res.send(messages);
});

app.listen(process.env.PORT || 3000);
         
