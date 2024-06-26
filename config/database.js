const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('classicmodels', 'root', '56281220', {
  host: 'localhost',
  dialect: 'mysql',
});

// Check database connection status
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  
module.exports = sequelize;
