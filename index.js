const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;



const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slkyjzr.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection create
    const coffeeColection = client.db('coffeeDB').collection('coffee');
    // create user collection:
    const userCollection = client.db('coffeeDB').collection('user');


    // read data base data
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeColection.find();

      const result = await cursor.toArray();
      res.send(result);
    })


    // insert data in the server
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);

      const result = await coffeeColection.insertOne(newCoffee);
      res.send(result);

    })

    //delete operation
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id; // get id  using params
      const query = { _id: new ObjectId(id) } //which the property in the delete in the specific in the delete id. get the match id. that's query is object.
      
      const result = await coffeeColection.deleteOne(query);
      res.send(result);
    })


    //update get data data in the coffe

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id; //get id using params
      const query = { _id: new ObjectId(id) };

      const result = await coffeeColection.findOne(query);
      res.send(result);
    })

    //update put data

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) }; //filter and query are same.
      //create options is upsert
      const options = { upsert: true };

      // get data form the body.
      const updatedCoffee = req.body;

      // set the update information of coffee
      const coffee = { 
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photp: updatedCoffee.photo
        }
      }

      const result = await coffeeColection.updateOne(filter, coffee, options);

      res.send(result);

    })

    // user data collection
    //get all user data 
    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);

      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    //update operation

    app.patch('/user', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // delete user
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//middle ware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Cofee making server is running');
})

app.listen(port, () => {
    console.log(`Cofee server is running port is: ${port}`);
})