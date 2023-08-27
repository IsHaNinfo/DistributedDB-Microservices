'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Orders', {
      
      order_id: {
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        unique:true,
        primaryKey:true
      },
      user_id: {
        type:DataTypes.STRING,
         allowNull:false
      },
      product_id: {
        type:DataTypes.STRING,
        allowNull:false
      },
      qty: {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('Orders');
  }
};