require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
const cors = require('cors')
const { default: mongoose } = require('mongoose')

app.use(cors())

// Middleware to capture the response body
const captureResponseBody = (request, response, next) => {
    let originalSend = response.send;
    let responseBody = '';
  
    response.send = function (body) {
      responseBody = body;
      return originalSend.apply(response, arguments);
    };
  
    response.on('finish', () => {
      request.responseBody = responseBody;
    });
  
    next();
  };
  
  app.use(captureResponseBody);
  
  // Define a custom token to log the requestuest body
  morgan.token('req-body', (request) => JSON.stringify(request.body));
  
  // Define a custom token to log the response body
  morgan.token('res-body', (request) => JSON.stringify(request.responseBody));
  
  // Use the custom tokens in the morgan format string
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body :res-body'));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  
  
// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/',(request,response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({})
      .then(persons => {
          response.json(persons);
      })
      .catch(error => next(error))
});

app.get('/api/persons/:id', (request, response,next) => {
  const id = request.params.id;
  console.log(id)
  Person.findById(id)
      .then(person => {
        console.log(person)
          if (person) {
              response.json(person);
          } else {
              response.status(404).end();
          }
      })
      .catch(error => next(error))
})


const getFullTime=(date)=>{
    // Format the date and time
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let day = days[date.getUTCDay()];
    let month = months[date.getUTCMonth()];
    let dayOfMonth = date.getUTCDate();
    let year = date.getUTCFullYear();
    let hours = date.getUTCHours() + 2; // Adjusting for GMT+0200
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let timezone = "GMT+0200 (Eastern European Standard Time)";

    // Format the output string
    let formattedDate = `${day} ${month} ${dayOfMonth} ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${timezone}`;
    return formattedDate
}
app.get('/info',(request,response,next)=>{
    let currentdate = new Date();
    Person.find({})
    .then(persons => {
      response.send(
        ` <p>Phonebook has info about ${persons.length} people</p>
        <br></br>
        <p>${getFullTime(currentdate)}</p>`
     )
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log(updatedPerson)
      return response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response,next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()})
    .catch(error=>next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

  app.post('/api/persons', (request, response,next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({ error: 'name missing' });
    }
    if (!body.number) {
        return response.status(400).json({ error: 'number missing' });
    }

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({ error: 'name must be unique' });
            } else{
              const newPerson = new Person({
                  name: body.name,
                  number: body.number,
              });
              return newPerson.save();
          }
        })
        .then(savedPerson => {
            if(savedPerson.statusCode!=400){
            console.log("saved...........");
            return response.json(savedPerson)
            }
        })
      .catch(error => next(error))

});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
// const PORT=process.env.PORT || 3001
const PORT=process.env.PORT
app.listen(PORT,()=>{console.log(`PORT =${PORT}`)})
