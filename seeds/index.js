const mongoose = require("mongoose");
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: "647a94c80f8d9391c24a4e10",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/482351",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt nulla nisi voluptate fuga reprehenderit at laborum! Hic nam quod vitae quaerat reprehenderit neque rerum dolorum adipisci, optio doloribus. Eaque, quaerat!",
            price
        })
        await camp.save();
    }
}


//closees mongo conection
seedDB().then(() => mongoose.connection.close())

