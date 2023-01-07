import AWS from 'aws-sdk';
import {createConnection} from '@typedorm/core';
import {DocumentClientV2} from '@typedorm/document-client';
import zeongTable from '../../db/tables/table';
import setResponse from '../../helpers/setResponse';
import {Route, Tags, Post, Body} from 'tsoa';
import {getEntityManager} from '@typedorm/core';
import * as dotenv from 'dotenv';
import {Student} from '../../db/entities/studentEntity';
dotenv.config();

// const region = `${process.env.REGION}`;
// const documentClient = new DocumentClientV2(
//   new AWS.DynamoDB.DocumentClient({
//     region: region,
//     credentials: {
//       accessKeyId: `${process.env.ACCESS_KEY}`,
//       secretAccessKey: `${process.env.ACCESS_SECRET}`,
//     },
//   }),
// );
// //initialize with specifying list of entities
// createConnection({
//   table: zeongTable,
//   entities: [Student],
//   documentClient,
// });

interface createStudent {
  Name: string;
  Gender: string;
  Title: string;
  Dob: string;
  Phone: string;
  Email: string;
  Address: string;
  PostalCode: number;
  Networking: string;
  Budget: number;
  EasyToGetIn: string;
  Location: string;
  ImmigrationOriented: string;
  Employment: string;
  OptionRange: string;
  Interests: string;
  Direction: string;
  CurrentMajor: string;
  CurrentDegree: string;
  EnglishLevel: JSON;
  OtherRewards: string;
  Scores: JSON;
}

@Route('/create')
@Tags('student-report')
export default class CreateStudent {
  @Post('/')
  async createStudent(@Body() body: any) {
    const student = new Student();
    student.Name = body.Name;
    student.Gender = body.Gender;
    student.Title = body.Title;
    student.Dob = body.Dob;
    student.Phone = body.Phone;
    student.Email = body.Email;
    student.Address = body.Address;
    student.PostalCode = body.PostalCode;
    student.Networking = body.Networking;
    student.Budget = body.Budget;
    student.EasyToGetIn = body.EasyToGetIn;
    student.Location = body.Location;
    student.ImmigrationOriented = body.ImmigrationOriented;
    student.Employment = body.Employment;
    student.OptionRange = body.OptionRange;
    student.Interests = body.Interests;
    student.Direction = body.Direction;
    student.CurrentMajor = body.CurrentMajor;
    student.CurrentDegree = body.CurrentDegree;
    student.EnglishLevel = body.EnglishLevel;
    student.OtherRewards = body.OtherRewards;
    student.Scores = body.Scores;

    const entityManager = getEntityManager();
    const response = await entityManager.create(student);
    return response;
  }
}
