const express = require("express");
const fetch = require("node-fetch");
const apicache = require('apicache');
const port = 5000;
const host = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";

const app = express();

let cache = apicache.middleware;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Custom-Header, Authorization");
  next();
});
app.use(cache("5 minutes"))

const getCategories = async (req, res) => {
  fetch("https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-categories")
    .then(async (response) => {
      res.status(response.status).json(await response.json());
    })
    .catch(() => {
      res.status(404).json([]);
    });
};

const getBooks = async (req, res) => {
  const { categoryId, size, page } = req.query;

  let params = new URLSearchParams({ categoryId, size, page });

  fetch(`https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-books?` + params)
    .then(async (response) => {
      res.status(response.status).json(await response.json());
    })
    .catch(() => {
      res.status(404).json([]);
    });
};

const getBooksById = async (req, res) => {
  const { id } = req.query;

  let params = new URLSearchParams({ id });

  fetch(`https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-books?` + params)
    .then(async (response) => {
      res.status(response.status).json(await response.json());
    })
    .catch(() => {
      res.status(404).json([]);
    });
};

app.get("/v1/books/categories", getCategories);
app.get("/v1/books", getBooks);
app.get("/v1/books/:id", getBooksById);

app.listen(port, host, () => console.log(`${host}:${port}`));
