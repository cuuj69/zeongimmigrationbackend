import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import sls from "serverless-http";
import router from "./routes/router";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.options("*", cors());
app.use("/api", router);

app.listen(3000, () => {
  console.log("app is runnnig on port 3000");
});

export const handler = sls(app);
