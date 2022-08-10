const {Sequelize, Model, DataTypes} = require('sequelize');

const database = new Sequelize(
    'abcInc',
    'postgres',
    'root',
    {
       host: 'localhost',
       dialect: 'postgres',
       omitNull: true
    }
);

database.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
  
database.sync().then(() => {
    console.log('Tables created successfully!');
}).catch((error) => {
    console.error('Unable to create tables : ', error);
});

module.exports = database