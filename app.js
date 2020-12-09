const app = require('express')();
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const expressHandlebars = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const formatDate = require('./helpers/formatDate')

const PORT = 3000;
// passport config
require('./config/passport')(passport)

// load dotenv config
dotenv.config();
connectDB();

app.engine(
    '.hbs',
    expressHandlebars({
        defaultLayout: 'main',
        'extname': '.hbs',
        helpers: {formatDate}
    }),
);

app.set('view engine', '.hbs');

// express middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// method override as middleware
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body ===  'object' && '_method' in req.body){
        let method = req.body._method;
        delete req.body._method;
        return method;
    }

}))

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));

app.listen(PORT, console.log('listening at port 3000'));