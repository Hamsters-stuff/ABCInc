var {Sequelize, Model, DataTypes} = require('sequelize');
var database = require('../db');

const User = database.define('User', {
    username: {
        type: DataTypes.STRING
    },
    hash: {
        type: DataTypes.STRING
    },
    salt: {
        type: DataTypes.STRING
    },
});

module.exports = User;