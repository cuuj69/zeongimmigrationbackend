import {
  Attribute,
  AutoGenerateAttribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';

@Entity({
  name: 'university',
  primaryKey: {
    partitionKey: 'UNI#{{id}}',
    sortKey: 'UNI#{{id}}',
  },
})
export class University {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
  })
  id: string;
  @Attribute()
  Name: string;
  @Attribute()
  Type: string;
  @Attribute()
  CanadianRanking: string;
  @Attribute()
  WorldRanking: JSON;
  @Attribute()
  Address: JSON;
  @Attribute()
  GoogleMapUrl: JSON;
  @Attribute()
  AddmissionEmail: JSON;
  @Attribute()
  Phone: string;
  @Attribute()
  WebsiteUrl: string;
  @Attribute()
  ApplicationDeadline: JSON;
  @Attribute()
  AdmissionRequirements: JSON;
  @Attribute()
  LangRequirements: JSON;
  @Attribute()
  Courses: JSON;
}
