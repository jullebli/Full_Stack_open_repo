
const Recommend = (props) => {
  if (!props.show) {
    return null
  }
  console.log(props.favoriteGenre)
  console.log(props.books)
  return (
    <div>
      <p>books in your favorite genre {props.favoriteGenre}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend
