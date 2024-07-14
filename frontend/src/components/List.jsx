const List = ({persons,handleDelete}) => {
  // console.log(persons)
  return (
    <ul>
      {persons.map(person =>
        <li key={person.name}>
          {person.name},{person.number},
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
      )}
    </ul>
  )
}

export default List