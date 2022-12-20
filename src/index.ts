import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import sls from "serverless-http";
import router from "./routes/router";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(morgan("tiny"));

app.options("*", cors());
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
);
app.use("/api", router);

app.listen(3000, () => {
  console.log("app is runnnig on port 3000");
});

export const handler = sls(app);
