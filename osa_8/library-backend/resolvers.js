const { UserInputError, AuthenticationError } = require("apollo-server");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let bookList = await Book.find({}).populate("author");
      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author });
        bookList = await Book.find({ author: foundAuthor.id }).populate(
          "author"
        );
      }
      if (args.genre) {
        if (args.genre !== "all genres") {
          bookList = await Book.find({
            genres: { $in: [args.genre] },
          }).populate("author");
        }
      }
      return bookList;
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
    allGenres: async () => {
      const books = await Book.find({});
      let bookGenres = books.map((b) => b.genres);
      //console.log("bookGenres", bookGenres);
      let distinctGenres = [];
      for (let i = 0; i < bookGenres.length; i++) {
        const genre = bookGenres[i];
        for (let j = 0; j < genre.length; j++) {
          if (!distinctGenres.includes(genre[j])) {
            distinctGenres.push(genre[j]);
          }
        }
      }
      //console.log("distinctGenres", distinctGenres);
      return distinctGenres;
    },
  },
  Author: {
    bookCount: async (root) => {
      const foundAuthor = await Author.findOne({ name: root.name });
      const bookList = await Book.find({ author: foundAuthor.id });
      return bookList.length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const foundAuthor = await Author.findOne({ name: args.author });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("Only logged in users can add books");
      }
      let book;

      if (foundAuthor) {
        foundAuthor.bookCount = foundAuthor.bookCount + 1;
        book = new Book({ ...args, author: foundAuthor.id });
      } else {
        const newAuthor = Author({ name: args.author, bookCount: 1 });
        await newAuthor.save().catch((error) => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        });
        book = new Book({ ...args, author: newAuthor.id });
      }
      await book.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });

      await currentUser.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });

      pubsub.publish("BOOK_ADDED", { bookAdded: book.populate("author") })
      return book.populate("author");
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("Only logged in users can edit authors");
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return await user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "samePasswordForAll") {
        throw new UserInputError("Wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED")
    }
  }
};

module.exports = resolvers;
