const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// connect to mongoDB start====================
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("conneted"))
  .catch((err) => console.log(err));
// connect to mongoDB end====================

// --------------- upload files start--------------------------------
//storage===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("Image has been uploaded");
});
// --------------- upload files end--------------------------------

// routes start======================
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
// routes end==============================
app.get("/home", (req, res) => {
  res.send(accomo);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
