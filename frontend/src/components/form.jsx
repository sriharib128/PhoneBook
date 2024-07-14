const Form = ({addNewPerson,newPerson,handleInputChange})=>{
    return(
    <form onSubmit={addNewPerson}>
        <div>
          name: <input name="name" value={newPerson.name} onChange={handleInputChange} />
          phone no: <input name="number" value={newPerson.number} onChange={handleInputChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
    )
}

export default Form