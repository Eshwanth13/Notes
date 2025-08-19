const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const path = require('path');
const flash = require('connect-flash'); 

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const isAuthenticated = require('./middleware/isAuthenticated');


dotenv.config();

const app = express();


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected'))
.catch(err => console.error(' MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
}));

const initializePassport = require('./config/passport');
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store'); 
    next();
});


app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/', authRoutes);                        
app.use('/notes', isAuthenticated, noteRoutes); 
app.use('/logout', isAuthenticated, (req, res) => {
    req.logout((err) => { 
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/login'); 
    });
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
