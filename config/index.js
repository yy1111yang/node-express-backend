module.exports = {
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "secret",
  COSMOSDB_USER: "vuecosmosdb",
  COSMOSDB_PASSWORD: "h4D2W8cMNfsZHm4Pc2GN24dlJBZQ9Pzhzl1ztKybteZnn3C1XzIlmXZciGC1etix1IesXJPDlcEUl4u0W2zBxA==",
  COSMOSDB_DBNAME: "conduit",
  COSMOSDB_HOST: "vuecosmosdb.mongo.cosmos.azure.com",
  COSMOSDB_PORT: 10255
};