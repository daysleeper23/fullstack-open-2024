
import { Model, DataTypes } from 'sequelize';
const { sequelize } = require('../util/db');

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER
  },
  // SHOULD NOT CREATE THIS FIELD DURING INITIAL MIGRATION
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: { model: 'user', key: 'id' },
  // },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: new Date().getFullYear(),
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
});

module.exports = Blog;

