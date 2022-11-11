const express = require("express");
const app = express();
const path = require("path");
const ImageModal = require("./image.modal");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const multer = require("multer");

//storage====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ukfxhcm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const accomodationCollection = client
      .db("refugeeAccomodation")
      .collection("accomodation");
    const userCollection = client
      .db("refugeeAccomodation")
      .collection("user");

    // Get Accomodations======================
    app.get("/accomodations", async (req, res) => {
      const query = {};
      const cursor = accomodationCollection.find(query);
      const accomodations = await cursor.toArray();
      res.send(accomodations);
    });

    // POST accomodation ==============
    app.post("/accomodations", upload.single("image"), async (req, res) => {
      const newAccomodation = req.body;
      const result = await accomodationCollection.insertOne(newAccomodation);
      res.send(result);
    });

    app.post("/accomodations", upload.single("image"), async (req, res) => {
      upload(req, res, (err) => {
        const data = req.body;
        if (err) {
          console.log(err);
        } else {
          const newImage = new ImageModal({
            people: data.people,
            rooms: data.rooms,
            city: data.city,
            from: data.from,
            to: data.to,
            email: data.email,
            phone: data.phone,
            title: data.title,
            description: data.description,
            image: {
              data: fs.readFileSync(
                path.join(__dirname + "/uploads/" + req.file.filename)
              ),
            },
          });
          newImage
            .save()
            .then(() => res.send("success"))
            .catch((err) => console.log(err));
        }
      });
    });
    // Delete accomodation =============
    app.delete("/accomodations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await accomodationCollection.deleteOne(query);
      res.send(result);
    });
    // Edit accomodation ================
    app.put("/accomodations/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: data.image,
          people: data.people,
          rooms: data.rooms,
          city: data.city,
          from: data.from,
          to: data.to,
          email: data.email,
          phone: data.phone,
          title: data.title,
          description: data.description,
        },
      };

      const result = await accomodationCollection.updateOne(
        filter,
        updateDoc,
        options
      );
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
