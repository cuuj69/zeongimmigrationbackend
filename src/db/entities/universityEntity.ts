// import {
//     Attribute,
//     AutoGenerateAttribute,
//     AUTO_GENERATE_ATTRIBUTE_STRATEGY,
//     Entity,
//     INDEX_TYPE,
//   } from '@typedorm/common';

// @Entity({
//     name: 'university',
//     primaryKey: {
//         partitionKey: 'UNI#{{id}}',
//         sortKey: 'UNINAME'
//     }
// })
// interface course {
//     applicationDeadline: string;
//     tuitionRequirement: JSON;
//     languageRequirement: JSON;
//     totalCost: string;
//     addmissionRequirement: JSON;
//     name: string;
//     faculty: [string];
//     courseDuration: string;
//     tutionFee: string;
// }
// export class University {
//     @AutoGenerateAttribute({
//         strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
//     })
//     id: string;
//     @Attribute()
//     geoLocation: string;
//     @Attribute()
//     applicationDeadline: string;
//     @Attribute()
//     tutionRequirement: JSON;
//     @Attribute()
//     languageRequirement: JSON;
//     @Attribute()
//     courses: JSON;
//     @Attribute()
//     name: JSON;
//     @Attribute()
//     Introduction

// }
