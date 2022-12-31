const { ApolloServer, UserInputError, gql } = require("apollo-server");
const { v1: uuid } = require("uuid");
require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
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
        bookList = await Book.find({ genres: { $in: [args.genre] } }).populate(
          "author"
        );
      }
      return bookList;
    },
    allAuthors: async () => await Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      const foundAuthor = await Author.findOne({ name: root.name });
      const bookList = await Book.find({ author: foundAuthor.id });
      return bookList.length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const foundAuthor = await Author.findOne({ name: args.author });
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
      return book;
    },
    editAuthor: async (root, args) => {
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
