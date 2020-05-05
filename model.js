
const Sequelize = require('sequelize');

const sequelize = new Sequelize('test_sertis', 'admin', 'admin1234', {
    host: 'database-1.cjlhex7dh9lz.ap-southeast-1.rds.amazonaws.com',
    dialect:'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

const MiniBlog = sequelize.define('mini_blog', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    blog_owner: {
        type: Sequelize.STRING,
        allowNull: false
    },
    card_name: {
        type: Sequelize.STRING,
    },
    content: {
        type: Sequelize.STRING,
    },
    category: {
        type: Sequelize.STRING,
    },
    blog_status: {
        type: Sequelize.STRING,
    }
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'mini_blog'
});

const BlogUser = sequelize.define('blog_user', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    token : {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_password: {
        type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
    },
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'blog_user'
});
module.exports = {
    MiniBlog,
    BlogUser
}
