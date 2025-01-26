const bcrypt = require('bcryptjs');
const db = require('./database');

exports.registerUser = (username, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(sql, [username, hashedPassword], function (err) {
            if (err) {
                console.error(err.message);
                return callback(err);
            }
            callback(null, { id: this.lastID });
        });
    });
};

exports.findUserByUsername = (username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return callback(err);
        }
        callback(null, row);
    });
};
