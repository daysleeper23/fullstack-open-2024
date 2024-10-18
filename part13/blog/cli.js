const { Model, Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

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
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.');

    const blogs = await Blog.findAll({ raw: true });

    //display all blogs in the database following the format: <Author>: <Title>, <likes> likes
    displayBlogs(blogs);

    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const displayBlogs = (blogs) => {
  blogs.forEach(blog => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });
}

main();