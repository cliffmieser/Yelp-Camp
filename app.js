const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const { campgroundSchema } = require('./schemas');

//gets rid of deprecation warning
// mongoose.set('strictQuery', true);


//callback support for mongoose V7
//IF error is unresolved:
// Replace Document.save(cb) with Document.save().then(document => cb(null, document)).catch(cb)
// Replace Query.exec(cb) with Query.exec().then(document => cb(null, document)).catch(cb)



mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected');
})

const app = express();


app.engine('ejs', ejsMate );
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//storing and unstoring user data in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use('/', userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) =>{
    res.render('home');
})


app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found!', 404));
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no! Something went wrong!';
    res.status(statusCode).render('error', {err} );
 
})

app.listen(3000, (req, res) =>{
    console.log('Serving on port 3000');
})