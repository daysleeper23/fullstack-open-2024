import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async ({ context }: { context: QueryInterface }) => {
    const queryInterface = context;
    
    await queryInterface.createTable('reading_lists', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    })
  },
  down: async ({ context }: { context: QueryInterface }) => {

    const queryInterface = context;
    await queryInterface.dropTable('reading_lists');
  },
}