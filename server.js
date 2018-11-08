const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const http = require('http');

const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const timeout = require('connect-timeout'); //express v4
const session = require('cookie-session');
var cookieParser = require('cookie-parser');

// Cookie parsing needed for sessions
app.use(cookieParser('notsosecretkey'));

// Session framework
app.use(session({
    secret: "notsosecretkey123",
    name: "cr_s",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

//Cors
//app.use(cors());
const corsOptions = {
    origin: true,
    credentials: true,

}
app.use(cors(corsOptions));

// Parsers
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

//secure the api with auth
let auth = (req, res, next) => {

    let uri = String(req.originalUrl);
    if (uri.indexOf('/account/setcookie') >= 0 || uri.indexOf('/account/login/fb') >= 0 || uri.indexOf('/account/login/g') >= 0 || uri.indexOf('/account/login') >= 0 || uri.indexOf('/account/register') >= 0)
        next();
    else {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, "lumixgm1", function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            next();
        });
    }
}
app.use(auth);

//our route
const user = require('./server/route/ruser');
const account = require('./server/route/raccount');

app.use('/api/user', user);
app.use('/api/account', account);

app.use(timeout('150s'));
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});



//Set Port
const port = '3005';
app.set('port', port);
http.globalAgent.maxSockets = Infinity;
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));