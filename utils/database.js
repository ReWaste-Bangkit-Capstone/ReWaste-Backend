const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgres://ssaqofax:yzzPtltAF978eWJ6caHMPKrzbKT6C81y@suleiman.db.elephantsql.com/ssaqofax'
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
