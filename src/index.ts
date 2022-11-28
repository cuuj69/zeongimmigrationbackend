import bodyParser from 'body-parser';
import cors from 'cors';
import * as express from 'express';
import sls from 'serverless-http';
import router from "./routes/router";

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.options('*', cors())
app.use('/api',router);

app.listen(3000, () => {
    console.log('app is runnnig on port 3000');
})

module.exports.handler = sls(app);