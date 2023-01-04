import { useApolloClient, useQuery } from "@apollo/client";
import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend"
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, GENRE_BOOKS, ME } from "./components/queries";
import { ALL_BOOKS } from "./components/queries";

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("user-token"));
  const authorsResult = useQuery(ALL_AUTHORS);
  let booksResult = useQuery(ALL_BOOKS);
  const currentUser = useQuery(ME)
  const [showGenres, setShowGenres] = useState("all genres");
  let genre

  if (page === "recommend") {
    genre = currentUser.data.me.favoriteGenre
    
  } else {
    genre = showGenres
  }
  const genreBooks = useQuery(GENRE_BOOKS, {
    variables: { genre: genre },
  });

  if (authorsResult.loading || booksResult.loading || genreBooks.loading || currentUser.loading) {
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
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button
              onClick={() => {
                setToken(null);
                localStorage.clear();
                setPage("authors");
                genre=showGenres
                client.resetStore()
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
      <Recommend show={page === "recommend"} favoriteGenre={genre} books={genreBooks.data.allBooks}/>
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
