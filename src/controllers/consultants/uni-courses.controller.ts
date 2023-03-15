import * as AWS from 'aws-sdk';
import {Client} from '@opensearch-project/opensearch';
import {AwsSigv4Signer} from '@opensearch-project/opensearch/aws';
import setResponse from '../../helpers/setResponse';
import {Route, Tags, Post, Body} from 'tsoa';
import * as dotenv from 'dotenv';
dotenv.config();

let region = `${process.env.REGION}`;
let esHost = `${process.env.ES_HOST}`;

const client = new Client({
  ...AwsSigv4Signer({
    region: region,
    // Must return a Promise that resolve to an AWS.Credentials object.
    // This function is used to acquire the credentials when the client start and
    // when the credentials are expired.
    // The Client will refresh the Credentials only when they are expired.
    // With AWS SDK V2, Credentials.refreshPromise is used when available to refresh the credentials.

    // Example with AWS SDK V2:
    getCredentials: () =>
      new Promise((resolve, reject) => {
        // Any other method to acquire a new Credentials object can be used.
        AWS.config.getCredentials((err, credentials: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(credentials);
          }
        });
      }),
  }),
  node: esHost, // OpenSearch domain URL
});

@Route('/search')
@Tags('search-uni-courses')
export default class UniCourses {
  @Post('/')
  async searchUniCourses(@Body() body: JSON) {
    const query = {
      _source: [
        '_id',
        'comments',
        '_parent',
        'name',
        'acronym',
        'address',
        'admissionEmail',
        'phoneNumber',
        'websiteURL',
        'languageRequirementURL',
        'admissionRequirement',
        'tuitionURL',
        'tuitionRange',
      ],
      query: {
        bool: {
          should: [
            {
              nested: {
                path: 'courses.major.minor',
                query: {
                  multi_match: {
                    query: `${body}`,
                    fields: [
                      'courses.major.minor.importantTag',
                      'courses.major.minor.courseName',
                    ],
                  },
                },
                inner_hits: {
                  size: 100,
                },
              },
            },
            {
              match_phrase: {
                name: `${body}`,
              },
            },
          ],
        },
      },
    };
    try {
      let search = await client.search({
        index: 'universities',
        body: query,
      });
      let resolvedPromise = await Promise.all([search]);
      let filteredResult = {};

      return resolvedPromise[0].body;
    } catch (err) {
      return setResponse(err.statusCode, {
        message: err.message,
      });
    }
  }
}
