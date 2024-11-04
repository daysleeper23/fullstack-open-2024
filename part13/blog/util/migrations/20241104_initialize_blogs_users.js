const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      author: {
        type: DataTypes.TEXT,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      url: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      likes: {
        type: DataTypes.DATE,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW
      }
    })
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.TIMESTAMP,
        defaultValue: DataTypes.NOW
      },
    })
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}