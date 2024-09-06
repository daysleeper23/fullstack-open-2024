const blog = require("../models/blog")

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

module.exports = {
  totalLikes,
  favoriteBlog
}