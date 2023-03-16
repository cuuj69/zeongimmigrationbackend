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
  async queryElasticSearch(body: any) {
    let search = await client.search({
      index: 'universities',
      body: body,
    });

    let resolvedPromise = await Promise.all([search]);
    return resolvedPromise[0].body.hits.hits;
  }

  @Post('/')
  async searchUniCourses(@Body() body: any) {
    if (body.rankings && body.locations && body.employments) {
      // create query for locations
      const locations = body.locations;
      const rankings = body.rankings;
      const employments = body.employments;

      //console.log(employments);
      // Locations search query
      const locationsSearchQuery = {
        _source: ['_id', 'comments', '_parent', 'name', 'geotag'],
        size: 100,
        query: {
          terms: {
            geotag: locations,
          },
        },
      };
      //Employments Seach Query
      const employmentsSearchQuery = {
        _source: ['name'],
        size: 100,
        query: {
          nested: {
            path: 'courses.minor',
            query: {
              terms: {
                'courses.minor.importantTag': employments,
              },
            },
          },
        },
      };

      try {
        // call the locations query
        const resolvedPromise = await this.queryElasticSearch(
          locationsSearchQuery,
        );
        const filteredLocationNames = resolvedPromise.map(
          (result: any) => {
            if (rankings.includes(result._source.name)) {
              return result._source.name;
            }
          },
        );
        console.log(filteredLocationNames);
        // eliminate the undefined values
        var filtered = filteredLocationNames.filter(
          (x: any) => x !== undefined,
        );

        let resolvedPromiseTwo = await this.queryElasticSearch(
          employmentsSearchQuery,
        );
        const filteredEmployments = resolvedPromiseTwo.map(
          (result: any) => {
            if (filtered.includes(result._source.name)) {
              return result._source.name;
            }
          },
        );
        var filteredTwo = filteredEmployments.filter(
          (x: any) => x !== undefined,
        );
        return filteredTwo;
      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    } else if (body.rankings && body.locations && !body.employments) {
      // Write Code Here

      const rankings = body.rankings;
      const locations = body.locations;

      // call query with Geotag and eliminate the unis from the rankings that are

      const locationsSearchQuery = {
        _source: ['_id', 'comments', '_parent', 'name', 'geotag'],
        size: 100,
        query: {
          terms: {
            geotag: locations,
          },
        },
      };

      try {
      

        // resolve the promise
        let resolvedPromise = await this.queryElasticSearch(locationsSearchQuery,);

        const filteredLocationNames =
          resolvedPromise.map((result: any) => {
            if (rankings.includes(result._source.name)) {
              return result._source.name;
            }
          });

        // eliminate the undefined values

        var filtered = filteredLocationNames.filter(
          (x: any) => x !== undefined,
        );
        return filtered;
      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    } else if (body.rankings && body.employments && !body.locations) {
      // Write Code Here

      const rankings = body.rankings;
      const employments = body.employments;

      // Employments Search Query
      const employmentsSearchQuery = {
        _source: ['name'],
        size: 100,
        query: {
          nested: {
            path: 'courses.minor',
            query: {
              terms: {
                'courses.minor.importantTag': employments,
              },
            },
          },
        },
      };

      try {
      
        //resolve the promise
        let resolvedPromise = await this.queryElasticSearch(employmentsSearchQuery,);

        

        //return an array of array of universities name
        const filteredEmployments = resolvedPromise.map(
          (result: any) => {
            if (rankings.includes(result._source.name)) {
              return result._source.name;
            }
          },
        );

        var filtered = filteredEmployments.filter(
          (x: any) => x !== undefined,
        );

        return filtered;
      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.messge,
        });
      }
    } else if (body.rankings && !body.locations && !body.employments) {
      // Write Code Here
      const rankings = body.rankings;

      // const rankingsSearchQuery;
      const normalizedRankings = rankings.map((name: any) =>
        name
          .toLowerCase()
          .replace(
            /^the?\s*(\S+)\s.*?(\b(?:university|college)\b)?$/g,
            '$1$2',
          )
          .trim(),
      );
      // const normalizedRankings = rankings.map(name => name.toLowerCase().replace(/^(the\s+)?(.+?)\s+(university|college)$/g, '$2').trim());

      // console.log(normalizedRankings);

      const rankingssearchQuery = {
        _source: ['name'],
        size: 100,
        query: {
          terms: {
            name: normalizedRankings,
          },
        },
      };

      try {
        let resolvedPromise = await this.queryElasticSearch(rankingssearchQuery,);

        const filteredRankings = resolvedPromise.map(
          (result: any) => {
            // if(rankings.includes(result._source.name)){
            return result._source.name;
            // }
          },
        );

        console.log(filteredRankings);

        var filtered2 = filteredRankings.filter(
          (x: any) => x !== undefined,
        );
        return filtered2;

      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    } else if (body.locations && !body.employments && !body.rankings) {
      // Write Code Here

      const locations = body.locations;

      // call the query with geoTag and return an array of the uniNames return by the

      const locationsSearchQuery = {
        _source: ['_id', 'comments', '_parent', 'name', 'geotag'],
        size: 100,
        query: {
          terms: {
            geotag: locations,
          },
        },
      };

      try {

        let resolvedPromise = await this.queryElasticSearch(locationsSearchQuery, )

        const filteredLocationNames =
          resolvedPromise.map((result: any) => {
            return result._source.name;
          });

        var filtered = filteredLocationNames.filter(
          (x: any) => x !== undefined,
        );

        return filtered;
      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    } else if (body.employments && !body.locations && !body.rankings) {
      //Write Code Here
      const employments = body.employments;

      // call the query with employemts cournames and return the array with the uni names

      const employmentsSearchQuery = {
        _source: ['name'],
        size: 100,
        query: {
          nested: {
            path: 'courses.minor',
            query: {
              terms: {
                'courses.minor.importantTag': employments,
              },
            },
          },
        },
      };
      try {
        let resolvedPromiseTwo = await this.queryElasticSearch(employmentsSearchQuery, )

        const filteredEmployments =
          resolvedPromiseTwo.map((result: any) => {
            return result._source.name;
          });

        var filtered = filteredEmployments.filter(
          (x: any) => x !== undefined,
        );
        return filtered;
      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    } else if (body.employments && body.locations && !body.rankings) {
      // Write Code here
      const employments = body.employment;
      const locations = body.locations;
      // in this condition we will call the query with the multiple field names

      const searchQuery = {
        _source: ['name'],
        size: 100,
        query: {
          terms: {
            geotag: locations,
            'courses.minor.importantTag': employments,
          },
        },
      };

      try {
      //   let search = await client.search({
      //     index: 'universities',
      //     body: searchQuery,
      //   });

        let resolvedPromise = await this.queryElasticSearch(searchQuery)

        const filteredQuery = resolvedPromise.map(
          (result: any) => {
            return result._source.name;
          },
        );
        return filteredQuery;
      } catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    }
    // const query = {
    //   _source: [
    //     '_id',
    //     'comments',
    //     '_parent',
    //     'name',
    //     'acronym',
    //     'address',
    //     'admissionEmail',
    //     'phoneNumber',
    //     'websiteURL',
    //     'languageRequirementURL',
    //     'admissionRequirement',
    //     'tuitionURL',
    //     'tuitionRange',
    //   ],
    //   query: {
    //     bool: {
    //       should: [
    //         {
    //           nested: {
    //             path: 'courses.minor',
    //             query: {
    //               multi_match: {
    //                 query: `${body}`,
    //                 fields: [
    //                   'courses.minor.importantTag',
    //                   'courses.minor.courseName',
    //                 ],
    //               },
    //             },
    //             inner_hits: {
    //               size: 100,
    //             },
    //           },
    //         },
    //         {
    //           match_phrase: {
    //             name: `${body}`,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // };
    console.log('inside');
  }
}
