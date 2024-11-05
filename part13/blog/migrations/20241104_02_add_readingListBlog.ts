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
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    });
    await queryInterface.addColumn('reading_lists', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
    await queryInterface.addColumn('reading_lists', 'blog_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    })
  },
  down: async ({ context }: { context: QueryInterface }) => {

    const queryInterface = context;
    await queryInterface.dropTable('reading_lists');
  },
}