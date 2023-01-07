import {createConnection} from "@typedorm/core";
import {DocumentClientV2} from "@typedorm/document-client";
import * as dotenv from "dotenv";
import zeongTable from "db/tables/table";
import {Student} from "db/entities/studentEntity";
import AWS from "aws-sdk";
dotenv.config();

const region = `${process.env.REGION}`;
const documentClient = new DocumentClientV2(
  new AWS.DynamoDB.DocumentClient({
    credentials: {
      accessKeyId: `${process.env.ACCESS_KEY}`,
      secretAccessKey: `${process.env.ACCESS_SECRET}`,
    },
  }),
);
//initialize with specifying list of entities
createConnection({
  name: "zeongTable",
  table: zeongTable,
  entities: [Student],
  documentClient,
});
