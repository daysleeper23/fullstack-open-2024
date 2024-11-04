const Blog = require('./Blog')
const User = require('./User')
const ReadingList = require('./ReadingList')

User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
  ReadingList
}