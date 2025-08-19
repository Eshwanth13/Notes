const express = require('express');
const router = express.Router();
const Note = require('../models/notes');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });

        if (req.headers.accept.includes('application/json')) {
            return res.json(notes);
        } else {
            return res.render('index', { notes });
        }
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).send('Server error');
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newNote = new Note({
            title,
            content,
            user: req.user._id
        });

        await newNote.save();

        
        res.redirect('/notes');
    } catch (err) {
        console.error('Error saving note:', err);
        res.status(500).send('Server error');
    }
});




// Update a note
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title, content }
        );
        res.json({ message: 'Note updated' });
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).send('Server error');
    }
});

// Delete a note
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
