const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) =>{
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) =>{
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash('success', 'welcome to YelpCamp!');
    res.redirect('/campgrounds');
    }catch (e) {
        let {existingUser} = e.message;
        existingUser = `A user with the given username: "${req.body.username}"
            already exists! `;
        req.flash('error', existingUser);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) =>{
    res.render('users/login')
})

//passport authenticate middleware that uses the local strategy with failure options
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
        req.flash('success', 'welcome back!');
        res.redirect("/campgrounds");
})

module.exports = router;