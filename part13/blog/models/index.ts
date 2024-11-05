const Blog = require('./Blog')
const User = require('./User')
const ReadingList = require('./ReadingList')

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(User, { through: ReadingList });
User.belongsToMany(Blog, { as: 'readings', through: ReadingList });

User.hasMany(ReadingList);
ReadingList.belongsTo(User);

Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

module.exports = {
  Blog,
  User,
  ReadingList
}