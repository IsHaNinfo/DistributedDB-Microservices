module.exports = {
  HOST: "localhost",
  PORT: "1433", //Depend on your server
  USER: "sat", //Depend on your server
  PASSWORD: "12345678", //Depend on your server
  DB: "products_db",
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
