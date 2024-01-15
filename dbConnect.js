const mongoose = require('mongoose');

const uri = 'mongodb+srv://mayankmotwani70:fsDmn3g0JutGTz8F@mayankscluster.laokceb.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('connected', () =>
    console.log('Database connected')
);
connection.on('error', (err) => {
    console.error('Error in database connection:');
    console.log(err);
});
