process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = app.listen(port);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');

const URI = require('./config/config').DB.URI;
const passport = require("passport");
const cookieParser = require('cookie-parser');
const io = require('socket.io').listen(server, {
    cookie: false
});

mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Ket noi thanh cong MongoDB')
    })
    .catch(err => console.log(err));

app.use(compression());
app.use(cors());
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public'));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

require('./socketio')(io);


app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/auth', require('./routes/authenticate'));
app.use('/api/logout', require('./routes/logout'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/authenticate', require('./routes/authenticate'));
app.use('/api/upload/avatar', require("./routes/uploadAvatar"));
app.use('/api/getAllUser', require('./routes/getUser'));
app.use('/api/message', require('./routes/message'));
app.use('/api/verifyEmail', require('./routes/verifyEmail'));