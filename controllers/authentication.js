const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/database');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) return res.status(500).send('Error saving user to database');
            res.redirect('/login');
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).send('User not found');
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send('Incorrect password');
            }

            req.session.user = user;
            res.redirect('/profile');
        });
    });
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('profile', { user: req.session.user });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
