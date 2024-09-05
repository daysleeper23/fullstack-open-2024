const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url =
  `mongodb+srv://charnel1986:${password}@cluster0.i0tm4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (!process.argv[3] && !process.argv[4]) {
  console.log('get all')
  Person
    .find({})
    .then(persons => {
    // console.log(result)
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}/n`)
      })
      mongoose.connection.close()
    })
}
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person
    .save()
    .then(() => {
      console.log(`added ${person.name} number ${person.number} saved!`)
      mongoose.connection.close()
    })
}
