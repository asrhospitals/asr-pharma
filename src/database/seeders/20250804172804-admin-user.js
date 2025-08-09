'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const existingAdmin = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM users WHERE uname = :uname',
      {
        replacements: { uname: 'admin' },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (existingAdmin[0].count > 0) {
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
      isactive: 'active',
      // createdAt: new Date(),
      // updatedAt: new Date()
    }]);
    console.log("Admin user created successfully.");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { uname: 'admin' });
  }
};
