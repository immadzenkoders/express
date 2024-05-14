const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const port = 3001;

app.use(bodyParser.json());

let flashcards = [];

// Read initial dummy data from flashcards.json
fs.readFile('flashcards.json', (err, data) => {
    if (err) {
        console.error('Error reading flashcards.json:', err);
        return;
    }
    flashcards = JSON.parse(data);
});

// Routes
app.get("/", (req, res) => {
    res.send({ message: "This is home page" });
});

app.get("/flashcards", (req, res) => {
    res.json(flashcards);
});

app.get('/flashcards/:id', (req, res) => {
    const id = req.params.id;
    const flashcard = flashcards.find(card => card.id === id);
    if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.json(flashcard);
});

app.post('/flashcards', (req, res) => {
    const { question, answer } = req.body;
    const newFlashcard = {
        id: (flashcards.length + 1).toString(),
        question,
        answer
    };
    flashcards.push(newFlashcard);
    fs.writeFile('flashcards.json', JSON.stringify(flashcards, null, 2), err => {
        if (err) {
            console.error('Error writing flashcards.json:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json(newFlashcard);
    });
});

app.put('/flashcards/:id', (req, res) => {
    const id = req.params.id;
    const { question, answer } = req.body;
    const flashcardIndex = flashcards.findIndex(card => card.id === id);
    if (flashcardIndex === -1) {
        return res.status(404).json({ error: 'Flashcard not found' });
    }
    flashcards[flashcardIndex] = { id, question, answer };
    fs.writeFile('flashcards.json', JSON.stringify(flashcards, null, 2), err => {
        if (err) {
            console.error('Error writing flashcards.json:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(flashcards[flashcardIndex]);
    });
});

app.delete('/flashcards/:id', (req, res) => {
    const id = req.params.id;
    const flashcardIndex = flashcards.findIndex(card => card.id === id);
    if (flashcardIndex === -1) {
        return res.status(404).json({ error: 'Flashcard not found' });
    }
    flashcards.splice(flashcardIndex, 1);
    fs.writeFile('flashcards.json', JSON.stringify(flashcards, null, 2), err => {
        if (err) {
            console.error('Error writing flashcards.json:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.sendStatus(204);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
