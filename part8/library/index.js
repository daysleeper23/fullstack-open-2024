const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

/*
  Mongoose 
*/
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    dummy: Int
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allGenres: [String!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addAuthor(
      name: String!
    ): Author

    authorSetBorn(
      name: String!
      setBornTo: Int!
    ): Author

    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (_root, args) => {
      let results = []
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        // console.log('has author', author)

        results = await Book.find({ author: author._id })
        // console.log('has author', results)

        if (args.genre) {
          // console.log('no genres')
          results = await results.filter(b => b.genres.includes(args.genre))
        }
      }
      else {
        // console.log('no author')
        if (args.genre) {
          // console.log('has genre')
          results = await Book.find({ genres: args.genre })
        }
        else {
          results = await Book.find({})
        }
      }
      // console.log('result', results)

      return results
    },
    allGenres: async () => {
      const genres = (await Book.find({ })).flatMap(b => b.genres)
      const uniqueGenres = await [...new Set(genres)]
      return uniqueGenres
    },
    allAuthors: async () => await Author.find({}),
    me: (_root, _args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => await Book.find({ author: root._id }).countDocuments()
  },
  Book: {
    author: async (root) => await Author.findById(root.author)
  },
  Mutation: {
    addAuthor: async (_root, args) => {
      const existingAuthor = await Author.find({ name: args.name })
      if (existingAuthor.length > 0) {
        throw new GraphQLError('Author name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      const author = new Author({ ...args })
      try {
        const savedAuthor = await author.save()
        return savedAuthor
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    authorSetBorn: async (_root, args, context) => {
      const user = context.currentUser
      if (!user) {
        throw new GraphQLError('Request unauthorized', {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const filter = { name: args.name }
      const update = { born: args.setBornTo }
      try {
        const updatedAuthor = await Author.findOneAndUpdate(filter, update, { new: true })
        return updatedAuthor
      }
      catch (error) {
        throw new GraphQLError('Update author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    addBook: async (root, args, context) => {
      const user = context.currentUser
      if (!user) {
        throw new GraphQLError('Request unauthorized', {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const existingBook = await Book.findOne({ title: args.title })
      // console.log('ex:', existingBook)
      if (existingBook !== null) {
        throw new GraphQLError('Book title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      try {
        // console.log('add new book')
        
        let existingAuthor = await Author.findOne({ name: args.author })
        if (existingAuthor ===  null) {
          // console.log('add author', args.author)

          try {
            await resolvers.Mutation.addAuthor(root, { name: args.author })
            existingAuthor = await Author.findOne({ name: args.author })
          }
          catch (error) {
            throw new GraphQLError(error.message, {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          }
        }
        // console.log('author', existingAuthor)

        const book = new Book({ ...args, author: existingAuthor.id })
        // console.log('book to add', book)
        const newBook = await book.save()
        // console.log('new book', newBook)

        return newBook
      }
      catch (error) {
        // console.log(error)
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },
    createUser: async (_root, args) => {
      const user = new User({ ...args })
      try {
        const createdUser = await user.save()
        return createdUser
      }
      catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            message: error.message
          }
        })
      }
    },
    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'sekret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const userForToken = {
        username : user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userForToken, process.env.SECRET)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})