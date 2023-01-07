import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import sls from 'serverless-http';
import router from './routes/router';
import swaggerUi from 'swagger-ui-express';
import zeongTable from './db/tables/table';
import {createConnection} from '@typedorm/core';
import {DocumentClientV2} from '@typedorm/document-client';
import {Student} from './db/entities/studentEntity';
import {University} from './db/entities/universityEntity';
import AWS from 'aws-sdk';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

// declare an aws region
const region = `${process.env.REGION}`;
// initiate dynamodb client
const documentClient = new DocumentClientV2(
  new AWS.DynamoDB.DocumentClient({
    region: region,
    credentials: {
      accessKeyId: `${process.env.ACCESS_KEY}`,
      secretAccessKey: `${process.env.ACCESS_SECRET}`,
    },
  }),
);

// initiate express app
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(morgan('tiny'));

app.options('*', cors());
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  }),
);

// initialize db connection
createConnection({
  table: zeongTable,
  entities: [Student, University],
  documentClient,
});

app.use('/api/v1', router);

app.listen(3001, () => {
  console.log('app is runnnig on port 3001');
});

export const handler = sls(app);
