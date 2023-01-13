import AWS from 'aws-sdk';
import {createConnection} from '@typedorm/core';
import {DocumentClientV2} from '@typedorm/document-client';
import zeongTable from '../../db/tables/table';
import setResponse from '../../helpers/setResponse';
import {Route, Tags, Post, Body} from 'tsoa';
import {getEntityManager} from '@typedorm/core';
import * as dotenv from 'dotenv';
import {University} from '../../db/entities/universityEntity';
dotenv.config();

const region = `${process.env.REGION}`;
const documentClient = new DocumentClientV2(
  new AWS.DynamoDB.DocumentClient({
    region: region,
    credentials: {
      accessKeyId: `${process.env.ACCESS_KEY}`,
      secretAccessKey: `${process.env.ACCESS_SECRET}`,
    },
  }),
);

//initialize with specifying list of entities
// createConnection({
//   table: zeongTable,
//   name: 'uni',
//   entities: [University],
//   documentClient,
// });

interface universities {
  Name: string;
  Acronym: string;
  Type: string;
  CanadianRanking: string;
  WorldRanking: JSON;
  Address: JSON;
  GoogleMapUrl: JSON;
  AddmissionEmail: JSON;
  Phone: string;
  WebsiteUrl: string;
  TuitionUrl: string;
  TuitionRange: string;
  ApplicationDeadline: JSON;
  AdmissionRequirements: JSON;
  LangRequirements: JSON;
  Courses: JSON;
}

@Route('/add')
@Tags('universities-data')
export default class CreateUniversity {
  @Post('/')
  async createUni(@Body() body: any) {
    const uni = new University();
    uni.Name = body.Name;
    uni.Acronym = body.Acronym;
    uni.Type = body.Type;
    uni.TuitionUrl = body.TuitionUrl;
    uni.CanadianRanking = body.CanadianRanking;
    uni.WorldRanking = body.WorldRanking;
    uni.Address = body.Address;
    uni.GoogleMapUrl = body.GoogleMapUrl;
    uni.AddmissionEmail = body.AddmissionEmail;
    uni.Phone = body.Phone;
    uni.WebsiteUrl = body.WebsiteUrl;
    uni.TutionRange = body.TuitionRange;
    uni.ApplicationDeadline = body.ApplicationDeadline;
    uni.AdmissionRequirements = body.AdmissionRequirements;
    uni.LangRequirements = body.LangRequirements;
    uni.Courses = body.Courses;

    const entityManager = getEntityManager();
    const response = await entityManager.create(uni);
    return response;
  }
}
