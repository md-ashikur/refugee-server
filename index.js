const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ukfxhcm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const accomodationCollection = client.db("refugeeAccomodation").collection("accomodation");

    // Get Accomodations======================
    app.get("/accomodations", async (req, res) => {
      const query = {};
      const cursor = accomodationCollection.find(query);
      const accomodations = await cursor.toArray();
      res.send(accomodations);
    });

    // POST accomodation ==============
    app.post('/accomodations', async (req, res) => {
    const newAccomodation = req.body;
    const result = await accomodationCollection.insertOne(newAccomodation);
    res.send(result);
    
    });


  } finally {
  }
}

run().catch(console.dir);

app.get("/home", (req, res) => {
  res.send(accomo);
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
