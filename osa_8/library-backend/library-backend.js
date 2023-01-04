const {
  ApolloServer,
  UserInputError,
  gql,
  AuthenticationError,
} = require("apollo-server");
const { v1: uuid } = require("uuid");
require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

console.log("connecting to", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 */

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
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
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    allGenres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

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

      return book;
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
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
