require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URL;
    
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if(process.argv.length>3){
  if(process.argv.length!==5){
    console.log('give both name and number as arguments')
    process.exit(1)
  }
  const person = new Person({
    name:process.argv[3],
    number:process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number}`)
    mongoose.connection.close()
  })
}
else{
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}