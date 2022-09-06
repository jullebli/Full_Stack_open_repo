import { useState } from "react";
import Select from "react-select";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from "./queries";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }
  const authors = props.authors;

  const edit = async (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, born: Number(born) } });

    setName("");
    setBorn("");
  };

  const handleChange = (event) => {
    setName(event.value)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={edit}>
        <Select
          onChange={handleChange}
          options={authors.map((author) => {
            return { value: author.name, label: author.name }
          })}
        ></Select>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
