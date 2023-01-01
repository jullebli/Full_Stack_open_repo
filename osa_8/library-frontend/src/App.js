import { useQuery } from "@apollo/client";
import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, GENRE_BOOKS } from "./components/queries";
import { ALL_BOOKS } from "./components/queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const authorsResult = useQuery(ALL_AUTHORS);
  let booksResult = useQuery(ALL_BOOKS);
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [showGenres, setShowGenres] = useState("all genres");
  const genreBooks = useQuery(GENRE_BOOKS, {
    variables: { genre: showGenres },
  });

  if (authorsResult.loading || booksResult.loading || genreBooks.loading) {
    return <div>loading...</div>;
  }

  if (showGenres !== "all genres") {
    booksResult = genreBooks
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button
              onClick={() => {
                setToken(null);
                localStorage.clear();
                setPage("authors");
              }}
            >
              logout
            </button>
          </>
        )}
      </div>
      <Authors
        show={page === "authors"}
        authors={authorsResult.data.allAuthors}
      />
      <Books
        show={page === "books"}
        books={booksResult.data.allBooks}
        showGenres={showGenres}
        setShowGenres={setShowGenres}
      />
      <NewBook show={page === "add"} />
      <LoginForm
        show={page === "login"}
        token={token}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
