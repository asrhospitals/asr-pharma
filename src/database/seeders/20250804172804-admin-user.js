'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

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
