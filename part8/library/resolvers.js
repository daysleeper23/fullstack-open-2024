const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')


const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (_root, args) => {
      console.log('get all Books')
      let results = []
      // console.log('author:', args.author, 'genre:', args.genre)

      if (args.author && args.author !== "all") {
        const author = await Author.findOne({ name: args.author })
        results = await Book.find({ author: author._id })

        if (args.genre && args.genre !== "all") {
          results = await results.filter(b => b.genres.includes(args.genre))
        }
      }
      else {
        if (args.genre && args.genre !== "all") {
          results = await Book.find({ genres: args.genre })
        }
        else {
          console.log('no author no genre')
          results = await Book.find({})
        }
      }

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
  // Author: {
  //   bookCount: async (root) => {
  //     console.log('book count for', root.name)
  //     return await Book.find({ author: root._id }).countDocuments()
  //   }
  // },
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
    authorSetBookCount: async (_root, args, context) => {
      const user = context.currentUser
      if (!user) {
        throw new GraphQLError('Request unauthorized', {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }

      const filter = { name: args.name }
      const update = { bookCount: args.setBookCountTo }
      try {
        const updatedAuthor = await Author.findOneAndUpdate(filter, update, { new: true })
        console.log('updated bookCOunt:', updatedAuthor)
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

        const book = new Book({ ...args, author: existingAuthor.id })
        const newBook = await book.save()
        
        //set new bookCount for author
        const bookCount = await Book.find({ author: existingAuthor.id }).countDocuments()
        await resolvers.Mutation.authorSetBookCount(root, { name: args.author, setBookCountTo: bookCount }, context)

        pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers