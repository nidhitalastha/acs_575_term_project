// npm install @apollo/server express graphql cors
import express from "express";
import cors from "cors";
import morgan from "morgan";

import logger from "./utils/logger.js";
import sequelize from "./models/index.js";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.date(req, res, "iso"),
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.httpVersion,
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);


await sequelize.authenticate();


app.get('/', (req, res) => {
  res.json({ status: 'API is running on /api' });
});

app.use("/", router);


app.listen(4000, () => {
  logger.info("Server is running on http://localhost:4000");
})
