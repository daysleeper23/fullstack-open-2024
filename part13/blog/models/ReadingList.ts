import { Model, DataTypes } from 'sequelize';
const { sequelize } = require('../util/db');

class ReadingList extends Model {}
ReadingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'readingList'
});

module.exports = ReadingList;

