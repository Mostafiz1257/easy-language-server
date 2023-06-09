const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esni35a.mongodb.net/?retryWrites=true&w=majority`;

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-848jnr6-shard-00-00.esni35a.mongodb.net:27017,ac-848jnr6-shard-00-01.esni35a.mongodb.net:27017,ac-848jnr6-shard-00-02.esni35a.mongodb.net:27017/?ssl=true&replicaSet=atlas-bmxs0j-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const languageCollection = client.db('language').collection('classes')
    const instructorsCollection = client.db('language').collection('instructors')
    const userCollection = client.db('language').collection('users')
    const classCollection = client.db('language').collection('myClass')

    //all classes get operation
    app.get('/classes', async (req, res) => {
      const result = await languageCollection.find().toArray()
      res.send(result)
    })

    //all instructors get operation
    app.get('/instructors', async (req, res) => {
      const result = await instructorsCollection.find().toArray();
      res.send(result)
    })

    // add to db post created user email and name
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email }
      const exitingUSer = await userCollection.findOne(query)
      if (exitingUSer) {
        return res.send({ message: 'exit user null' })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          role: 'instructor'
        },
      }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    //select class by email
    app.get('/myClass', async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([])
      }
      const query = { email: email }
      const result = await classCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/myClass', async (req, res) => {
      const classItem = req.body
      const result = await classCollection.insertOne(classItem)
      res.send(result)
    })

    app.delete('/myClass/:id', async (req, res) => {
      const id = req.params.id;
      const deleteClass = { _id: new ObjectId(id) }
      const result = classCollection.deleteOne(deleteClass)
      res.send(result)

    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Learn a new Language')
})

app.listen(port, () => {
  console.log(`server is running of port ${port}`);
})