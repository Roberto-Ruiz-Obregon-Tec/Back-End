const dotenv = require('dotenv');
const functions = require('firebase-functions');
const mongoose = require('mongoose');

// Read env variables and save them
dotenv.config();

// Error catching
process.on('unhandledException', (err) => {
    console.log('UNHANDLED EXCEPTION!: SHUTTING DOWN');
    console.log(err.name, err.message);
    console.log(err);
    process.exit(1);
});

// Connect using mongoose
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
).replace('<user>', process.env.DATABASE_USER);

// Connection
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        dbName: process.env.DNAME === undefined ? "test" : process.env.DNAME
    })
    .then((con) => {
        console.log('Connection to DB successful');
    })
    .catch((err) => console.log('Connection to DB rejected', err));

const app = require(`${__dirname}/app.js`);

const port = process.env.PORT;

// app.listen nos regresa un objeto de
let server = null;
if (process.env.IS_DEPLOY !== "true") {
    server = app.listen(port, () => {
        console.log(`Server running on ${port}...`);
    });
}

// UNHANDLED REJECTION
/* Catching unhandled rejections. */
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION!: SHUTTING DOWN');
    if (process.env.IS_DEPLOY !== "true") {
        server.close(() => {
            process.exit(1);
        });
    }
});

// SERVER SHUTDOWN
/* A signal that is sent to the process to tell it to terminate. */
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down.');
    if (process.env.IS_DEPLOY !== "true") {
        server.close(() => {
            console.log('Process terminated.');
        });
    }
});

if (process.env.DEPLOY_ENV === "production") {
    exports.api = functions.https.onRequest(app);
} else if (process.env.DEPLOY_ENV === "test") {
    exports.test = functions.https.onRequest(app);
};