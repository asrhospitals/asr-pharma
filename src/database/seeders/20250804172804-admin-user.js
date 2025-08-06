'use strict';
const bcrypt = require('bcrypt');
const db = require('../../database');
const User = db.User;
module.exports = {
  async up (queryInterface, Sequelize) {
    const existingAdmin = await User.findOne({ where: { uname: 'admin' } });
    if (existingAdmin) {
      console.log("Admin user already exists, skipping creation.");
      return;
    }

    const hashedPwd = await bcrypt.hash('admin123', 12);
    await queryInterface.bulkInsert('users', [{
      uname: 'admin',
      pwd: hashedPwd,
      role: 'admin',
      module: ['all'],
      fname: 'Admin',
      lname: 'Admin',
      isactive: 'active'
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { uname: 'admin' });
  }
};
