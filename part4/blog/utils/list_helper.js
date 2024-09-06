const blog = require("../models/blog")
const _ = require('lodash');

const totalLikes = (blogs) => {
  // ...
  const totalLikes = blogs.reduce((sum, blog) => sum = sum + blog.likes, 0)
  return blogs.length == 0
    ? 0
    : totalLikes
}

const favoriteBlog = (blogs) => {

  if (blogs.length == 0)
    return {}

  const likes = blogs.map(blog => blog.likes)
  const topLikes = Math.max(...likes)
  const favoriteIndex = likes.indexOf(topLikes)
  const topBlog = {
    title: blogs[favoriteIndex].title,
    author: blogs[favoriteIndex].author,
    likes: blogs[favoriteIndex].likes
  }
  
  return topBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length == 0)
    return {}

  if (blogs.length == 1)
    return {
      author: blogs[0].author,
      blogs: 1
    }
  
  // Count the number of blogs for each author
  const authorCounts = _.countBy(blogs, 'author');

  // Find the author with the maximum number of blogs
  const topAuthor = _.maxBy(Object.keys(authorCounts), author => authorCounts[author]);

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor] 
  };
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
}