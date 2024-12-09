const mongoose = require('mongoose');
const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName : "MY_OWN_PORTFOLO"
    }).then(() => {
        console.log('database connection succefully....');
    }).catch((err) => console.log(err));
}

module.exports = dbConnection