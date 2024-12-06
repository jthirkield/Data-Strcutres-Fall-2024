//import modules

//axios manages requests to severs
const axios = require('axios');
//mongodb driver
const { MongoClient } = require("mongodb")
//loading in your uri from the file
const uri = require("./atlas_uri")

//setting up the connection variables
// make sure that the names you gave your database and collection
//matach these exactly
const client = new MongoClient(uri)
const dbname = "datastructures"
const collection_name = "books"

//this will contain the connection
const accountsCollection = client.db(dbname).collection(collection_name)

//function that connects to the database
const connectToDatabase = async () => {
    try {
      await client.connect()
      console.log(`Connected to the ${dbname} database 🌍`)
    } catch (err) {
      console.error(`Error connecting to the database: ${err}`)
    }
  }

//function that inserts the documents into the database
//this is called each time the API is successfully queried
const main = async (dataset) => {
    try {
      await connectToDatabase();
      // the insert command is here
      let result = await accountsCollection.insertMany(dataset)
      console.log(`Inserted ${result.insertedCount} documents`);
    } catch (err) {
      console.error(`Error inserting documents: ${err}`);
    } finally {
      await client.close();
    }
};

// the URL for the API
const URL = "https://gutendex.com/books/";

//this function uses axios builds the parameters and connect to the URL
const fetchPosts = async (num) => {
  try {
    const data = await axios.get(URL, {
  params: {
    "author_year_start": "1800",
    "languages": "en",
    "page": num
  }
});
    return data;
  } catch (error) {
    console.log(error);
  }
};

//this function loops through 100 pages
//each page will return 32 documents in JSON format

const getPostsAsync = async () => {
    console.log("Start Async");
  for (let i=1; i < 101; i++) {
    const post = await fetchPosts(i);
    console.log(i);
//send the 32 objects to the mongo database
   main(post.data.results)
    }
};
//gets everything started
getPostsAsync();
