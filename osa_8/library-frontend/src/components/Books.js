import { useQuery } from "@apollo/client";
import { ALL_GENRES } from "./queries";

const Books = (props) => {
  const allGenres = useQuery(ALL_GENRES);
  if (!props.show) {
    return null;
  }

  const books = props.books;

  if (allGenres.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>
      <p>in genre {props.showGenres}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.data.allGenres.map((genre) => {
        return (
          <button key={genre} onClick={() => props.setShowGenres(genre)}>
            {genre}
          </button>
        );
      })}
      <button onClick={() => props.setShowGenres("all genres")}>all genres</button>
    </div>
  );
};

export default Books;
