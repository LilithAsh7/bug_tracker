require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('bug_tracker', process.env.db_user, process.env.db_password, {host: 'localhost', dialect: 'postgres'});

const User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
});

const Group = sequelize.define('Group', {
    name: Sequelize.STRING,
});

const UserGroup = sequelize.define('UserGroup', {
    // Additional fields, if needed
});

// Define associations
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });