var {Sequelize, Model, DataTypes} = require('sequelize');
var database = require('../db');

const Task = database.define('Task', {
    user_id: {
        type: DataTypes.INTEGER
    },
    task: {
        type: DataTypes.STRING
    },
    summary: {
      type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
});

module.exports = Task;