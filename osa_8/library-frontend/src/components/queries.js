import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      id
      genres
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation setBorn(
    $name: String!
    $born: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $born
    ) {
      name
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
mutation login(
  $username: String!
  $password: String!
) {
  login(
    username: $username
    password: $password
  ) {
    value
  }
}
`;
