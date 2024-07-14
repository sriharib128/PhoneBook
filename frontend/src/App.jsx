import { useEffect, useState } from 'react'
import NoteServices from './services/notes'
import List from './components/List'
import Search from './components/search'
import Form from './components/form'
const App = () => {

  const [persons, setPersons] = useState([])
  const hook = () =>{
    console.log('effect')
    NoteServices.getAll().then(fetchedPersons =>{
        // console.log(fetchedPersons)
          console.log('promise fullfiled')
          setPersons(fetchedPersons)
        })
    console.log("fetched from server")
}

  useEffect(hook,[])

  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [searchString, setSearchString] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewPerson({ ...newPerson, [name]: value })
  }

  const handleSearchChange = (event) => setSearchString(event.target.value)

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newPerson.name)) {
      const id = persons.find(person => person.name === newPerson.name).id
      if (window.confirm(`${newPerson.name}'s number will be updated`)){
          NoteServices.update(id,newPerson).then(updatedText=>{
            console.log("Updated...",updatedText)
            setPersons(persons.map(person => person.id !== updatedText.id ? person : updatedText))
          })
      }
    } 
    else {
      console.log("adding")
      NoteServices.add(newPerson).then(newData => {
        const updatedPersons=persons.concat(newData)
        console.log(updatedPersons);
        setPersons(updatedPersons)
      })      
    }
    setNewPerson({ name: '', number: '' })
  }

  const personsToShow = searchString
    ? persons.filter(person => person.name.toLowerCase().includes(searchString.toLowerCase()))
    : persons

    const handleDelete = (id) =>{
        if( window.confirm("Do you want to delete ",persons.find(person => person.id===id).name)){
        NoteServices.del(id).then(deltedText =>{
          console.log("deleting...",id)
          setPersons(persons.filter(person => person.id!==id ))
        })
      }
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Form
      addNewPerson={addNewPerson}
      newPerson={newPerson}
      handleInputChange={handleInputChange}
      />

      <Search 
      searchString={searchString}
      handleSearchChange={handleSearchChange}
      />

      <h2>Search Results</h2>
      <List persons={personsToShow} handleDelete={handleDelete}/>
      
      <h2>Numbers</h2>
      <List persons={persons} handleDelete={handleDelete}/>
    
    </div>
  )
}

export default App
