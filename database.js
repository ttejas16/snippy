const mongoose = require('mongoose');

async function connectDatabase() {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("database connected");
        })
        .catch((err) => {
            console.log("something went wrong " + err);
        })
}

module.exports = { connectDatabase };