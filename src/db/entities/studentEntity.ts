import {
  Attribute,
  AutoGenerateAttribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';
import {text} from 'aws-sdk/clients/customerprofiles';

@Entity({
  name: 'student',
  primaryKey: {
    partitionKey: 'STUDENT#{{id}}',
    sortKey: 'STUDENT#{{id}}',
  },
})
export class Student {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
  })
  id: string;
  @Attribute()
  Name: string;
  @Attribute()
  Gender: string;
  @Attribute()
  Title: string;
  @Attribute()
  Dob: string;
  @Attribute()
  Phone: string;
  @Attribute()
  Email: string;
  @Attribute()
  Address: string;
  @Attribute()
  PostalCode: number;
  @Attribute()
  Networking: string;
  @Attribute()
  Budget: number;
  @Attribute()
  EasyToGetIn: string;
  @Attribute()
  Location: string;
  @Attribute()
  ImmigrationOriented: string;
  @Attribute()
  Employment: string;
  @Attribute()
  OptionRange: string;
  @Attribute()
  Interests: string;
  @Attribute()
  Direction: string;
  @Attribute()
  CurrentMajor: string;
  @Attribute()
  CurrentDegree: string;
  @Attribute()
  EnglishLevel: JSON;
  @Attribute()
  OtherRewards: string;
  @Attribute()
  Scores: JSON;
}

// Networking: clientinfo – networking
// Budget: clientinfo – budget
// Easy to get in: clientinfo-easytoGetIn
// Location: clientinfo – preferredLocation
// Immigration oriented: clietinfo – immigrationOriented
// Employment and placement: clientinfo-employment
// Option Range: clientinfo-optionRange
// Interests: clientinfo – interests
// Direction: clientinfo – direction
// Current Major: clientinfo  currentMajor
// Current Degree: clientinfo – currentDegree
// English Level: clientinfo – englishLevel
// This is a bit tricky. For now, assume only IELTS tests and use this format and take an average of the 4 marks and display the average here.
// Other rewards: clientinfo – otherRewards
// Scores:
// Clientinfo – seniorHighAverage + %
// Clientinfo – GaokaoAverage + %
// Clientinfo - HuikaoAverage + %
