/**
 * (main entry file) express server module
 */
import express from 'express';
import cors from 'cors';
import { sheetsRouter, unknownRouter } from './routes';
import { handleErrors, requestInterceptor } from './middlewares';
const qs = require('qs');
require("dotenv").config()
export const app = express();


//parser
app.set('query parser', function (str) {
        console.log("Before decode - " + str);
        let decoded = qs.parse(str, { decoder: function (s) { return decodeURIComponent(s); } });
        console.log("After decode - " + JSON.stringify(decoded));
        return decoded;
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// configure CORS headers
app.use(cors());

//use request interceptors
app.use(requestInterceptor);

//handle brizo routes
app.use('/api/apps', sheetsRouter);

//handle unknown routes
app.use('*', unknownRouter);

//handle errors
app.use(handleErrors);

let port = process.env.PORT || 4002;
let host = process.env.HOST || 'localhost';
app.listen(port, () => {
        console.log(`Server started on host (${host}) and port (${port}).`);
});

