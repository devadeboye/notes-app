const express = require('express');
const { ensureGuest, ensureAuth } = require('../middleware/auth');
const router = express.Router();
const Note = require('../models/Note');

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
})

router.get('/dashboard', ensureAuth, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).lean();
    const context = {
        name: req.user.firstName,
        notes,
        imgSrc: req.user.image,
    };
    res.render('dashboard', context);
})

module.exports = router;