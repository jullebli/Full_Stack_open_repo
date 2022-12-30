const { ApolloServer, gql } = require("apollo-server");
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
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
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
      //if (args.author) {
      //  bookList = bookList.filter((book) => book.author === args.author);
      //}
      //if (args.genre) {
      //  bookList = bookList.filter((book) => book.genres.includes(args.genre));
      //}
      return Book.find({});
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (root) => Book.find({ author: root.name }).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      const foundAuthor = await Author.findOne({ name: args.author });
      //console.log("foundAuthor", foundAuthor);
      let book;

      if (foundAuthor) {
        foundAuthor.bookCount = foundAuthor.bookCount + 1;
        book = new Book({ ...args, author: foundAuthor });
      } else {
        const newAuthor = Author({ name: args.author, bookCount: 1 });
        //console.log("newAuthor", newAuthor);
        await newAuthor.save();
        book = new Book({ ...args, author: newAuthor });
      }

      return book.save();
    },
    editAuthor: async (root, args) => {
      /*
      const author = Author.find({ name: args.name });
      if (!author) {
        return null;
      }

      const editedAuthor = { ...author, born: args.setBornTo };

      return editedAuthor.save; */
      return await Author.update({ name: args.name }, { born: args.setBornTo})
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
