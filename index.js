const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.SECRET_PASSWORD}@cluster0.pdzlhd7.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const invoiceCollection = client.db("invoice-app").collection("invoices");

    app.post("/addInvoice", async (req, res) => {
      const invoices = req.body;
      const result = await invoiceCollection.insertOne(invoices);
      res.send(result);
    });

    app.get("/getInvoice", async (req, res) => {
      const result = await invoiceCollection.find().toArray();
      res.send(result);
    });
    app.get("/getInvoice/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await invoiceCollection.findOne(query);
      res.send(result);
    });
    app.delete("/getInvoice/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await invoiceCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/updateInvoice/:id", async (req, res) => {
      const data = req.body;
      const { name } = data;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateInvoice = {
        $set: {
          name: name,
        },
      };
      const result = await invoiceCollection.updateOne(query, updateInvoice);
      res.send(result);
    });

    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This server is running");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
