"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const prerender = require('prerender-node');
const assetcheck_mw_1 = require("./middleware/assetcheck.mw");
const api_1 = require("./api");
let app = express();
let clientPath = path.join(__dirname, '../client');
prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);
app.use(prerender);
app.use(express.static(clientPath));
app.use(bodyParser.json());
app.use(cookieParser());
app.get('*', assetcheck_mw_1.default);
app.use('/api', api_1.default);
app.listen(process.env.PORT || 3000);