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
  async searchUniCourses(@Body() body: any) {
    // 1. We have Data from the Rankings i.e ==> Faculty Ranking's data or General Top 8
    // ['Rankings', ['Toronto', 'UBC', 'SF', 'Calgary']]
    // var parsedBodyParamOne = ['Rankings', ['Toronto', 'UBC', 'SF', 'Calgary']]

    // 2. We have Data from the Location i.e ==> West or East sides in Canada
    // ['Location', ['West', 'East']]
    // var parsedBodyParamTwo = ['Location', ['West', 'East']]

    // 3. We have Data from Employment i.e ==> Employment Type like Computer Scientest, Nursing
    // ['Employment', ['Computer Scienties', 'Nurse', 'Auditor']].
    // var parsedBodyParamThree = ['Employment', ['Computer Scienties', 'Nurse', 'Auditor']]

    // We need to sort out what body payloads are being sent to the Api
    // Now we need to create the search query according.

    // if(!Rankings && !Location && Employment) {
    // we need to create a search query which only contains the employments
    // ['Computer Scienties', 'Nurse', 'Auditor']
    //} elseif (Rankings && !Location && !Employment) {
    // we need to create a search query which only contains the Ranking
    // ['Toronto', 'UBC', 'SF', 'Calgary']
    //} elseif (Location && !Rankings && !Employement) {
    // we need to create a seach query which only contains the Locations
    // ['West', 'East']
    //} elseif (Location && Rankings && !Employement) {
    // we need to create a search query which contains both the Rankings and the Locations
    // first search the universities that are present in these locations
    // var data = response from the ES.
    // var unis = ['Toronto', 'UBC', 'SF', 'Calgary'];
    // var newUnis = unis.map((result) => {
    // eliminate the unis which are not present in the locations data.
    //})
    // now the search query will be made with newUnis.
    //} elseif (Location && Rankings && Employement) {
    // create a set of data which is present in all three
    // lets say the unis which are not present in the locations and employment type should eliminated
    // and the resultant variable should be sent to main query.
    //} elseif (Rankings && Employment && !Location)

    if (body.rankings && body.locations && body.employments) {
      // create query for locations
      const locations = body.locations;
      const rankings = body.rankings;
      const employments = body.employments;

      console.log(employments);
      // Locations search query
      const locationsSearchQuery = {
        _source: ['_id', 'comments', '_parent', 'name', 'geotag'],
        query: {
          terms: {
            geotag: locations,
          },
        },
      };
      //Employments Seach Query
      const employmentsSearchQuery = {
        _source: ['name'],
        query: {
          nested: {
            path: 'courses.minor',
            query: {
              terms: {
                'courses.minor.courseName': employments,
              },
            },
          },
        },
      };

      try {
        // call the locations query
        let search = await client.search({
          index: 'universities',
          body: locationsSearchQuery,
        });
        // resolve the promise
        let resolvedPromise = await Promise.all([search]);
        // map through the results of the locations query and return an
        // array of universities names which are present in the rankings payload
        console.log(resolvedPromise[0].body.hits.hits);
        const filteredLocationNames =
          resolvedPromise[0].body.hits.hits.map((result: any) => {
            if (rankings.includes(result._source.name)) {
              return result._source.name;
            }
          });
        // eliminate the undefined values
        var filtered = filteredLocationNames.filter(
          (x: any) => x !== undefined,
        );
        //console.log('Filtered Locations', filtered);

        // call the employments query
        let searchTwo = await client.search({
          index: 'universities',
          body: employmentsSearchQuery,
        });
        //resolve the promise
        let resolvedPromiseTwo = await Promise.all([searchTwo]);
        //map through the results of the employments query and return an
        //array of universities names which are present in "filteredLocationNames"
        const filteredEmployments =
          resolvedPromiseTwo[0].body.hits.hits.map((result: any) => {
            if (filtered.includes(result._source.name)) {
              return result._source.name;
            }
          });
        console.log(filteredEmployments);
        // remove the undefined values
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
        query: {
          terms: {
            geotag: locations,
          },
        },
      };

      try {
        let search = await client.search({
          index: 'universities',
          body: locationsSearchQuery,
        });

        // resolve the promise
        let resolvedPromise = await Promise.all([search]);

        // map through the results of the locations query
        // return an array of universities names which are present in the rankings payload

        const filteredLocationNames = resolvedPromise[0].body.hits.hits.map((result:any) => {
          if(rankings.includes(result._source.name)){
            return result._source.name
          }
        });

        // eliminate the undefined values

        var filtered = filteredLocationNames.filter((x:any) => x !== undefined,);
        return filtered
      } catch (err){
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        });
      }
    } else if (body.rankings && body.employments && !body.locations) {
      // Write Code Here
      
      const rankings = body.rankings;
      const employments = body.employments

      // Employments Search Query
      const employmentsSearchQuery = {
        _source: ['name'],
        query: {
          nested: {
            path: 'courses.minor',
            query: {
              terms: {
                'courses.minor.courseName': employments,
              },
            },
          },
        },
      };

      try{
        let search = await client.search({
          index: 'universities',
          body: employmentsSearchQuery
        })

        //resolve the promise
        let resolvedPromise = await Promise.all([search])

        //map through the results of them employments query

        //return an array of array of universities name
        const filteredEmployments = resolvedPromise[0].body.hits.hits.map((result:any) => {
          if(rankings.includes(result._source.name)){
            return result._source.name
          }
        });

        var filtered = filteredEmployments.filter((x: any) => x !== undefined,);
        return filtered
      }catch (err) {
        console.log(err);
        return setResponse(err.statusCode, {
        message: err.messge,
        });
        }
      
    } else if (body.rankings && !body.locations && !body.employments) {
          // Write Code Here
          const rankings = body.rankings;
      
          // const rankingsSearchQuery;
          const normalizedRankings = rankings.map((name:any) => name.toLowerCase().replace(/^the?\s*(\S+)\s.*?(\b(?:university|college)\b)?$/g, '$1$2').trim());
          // const normalizedRankings = rankings.map(name => name.toLowerCase().replace(/^(the\s+)?(.+?)\s+(university|college)$/g, '$2').trim());
    
          console.log(normalizedRankings)
        
          const rankingssearchQuery = {
            _source: ['name'],
            query: {
              terms: {
               name : normalizedRankings
              }
            }
          }
          
          try {
            let search = await client.search({
              index: 'universities',
              body: rankingssearchQuery
            })
    
            // resolve the promise
            let resolvedPromise = await Promise.all([search])
    
            console.log(resolvedPromise)
    
            const filteredRankings = resolvedPromise[0].body.hits.hits.map((result: any) => {
              // if(rankings.includes(result._source.name)){
                return result._source.name
              // }
            });
    
            console.log(filteredRankings)
    
            var filtered2  = filteredRankings.filter((x: any) => x !== undefined,);
            return filtered2
          } catch (err){
            console.log(err);
            return setResponse(err.statusCode,{
              message: err.message,
            });
          }
    } else if (body.locations && !body.employments && !body.rankings) {
     
      // Write Code Here

      const locations = body.locations;
      
      // call the query with geoTag and return an array of the uniNames return by the

      const locationsSearchQuery = {
        _source: ['_id', 'comments', '_parent', 'name', 'geotag'],
        query: {
          terms: {
            geotag: locations,
          },
        },
      };

      try {
        let search  = await client.search({
          index: 'universities',
          body: locationsSearchQuery,
        });

        let resolvedPromise = await Promise.all([search]);

        const filteredLocationNames = 
        resolvedPromise[0].body.hits.hits.map((result: any) => {
        return result._source.name;
        
        });

        var filtered = filteredLocationNames.filter((x: any) => x !== undefined,);

        return filtered

      } catch (err){
        console.log(err);
        return setResponse(err.statusCode, {
          message: err.message,
        })
      }

    } else if (body.employments && !body.locations && !body.rankings) {
      //Write Code Here
      const employments = body.employments

      
      // call the query with employemts cournames and return the array with the uni names

      const employmentsSearchQuery = {
        _source: ['name'],
        query: {
          nested: {
            path: 'courses.minor',
            query: {
              terms: {
                'courses.minor.courseName': employments,
              },
            },
          },
        },
      };
      try {
      let search = await client.search({
        index: 'universities',
        body: employmentsSearchQuery
      });

      let resolvedPromiseTwo = await Promise.all([search])

      const filteredEmployments = resolvedPromiseTwo[0].body.hits.hits.map((result: any) => {
        return result._source.name
      })

      var filtered = filteredEmployments.filter((x: any) => x!== undefined,);
      return filtered
    } catch (err){
      console.log(err);
      return setResponse(err.statusCode, {
        message:err.message,
      });
    }
    } else if (body.employments && body.locations && !body.rankings) {
       // Write Code here
       const employments = body.employment;
       const locations = body.locations
       // in this condition we will call the query with the multiple field names
       
       
       
       const searchQuery = {
         _source: ['name'],
         query: {
           terms:{
             geotag: locations,
             'courses.minor.courseName': employments,
           }
         }
       }
       
       try{
         let search = await client.search({
           index: 'universities',
           body: searchQuery,
         })
 
         let resolvedPromise = await Promise.all([search]);
 
         const filteredQuery = resolvedPromise[0].body.hits.hits.map((result: any) => {
           return result._source.name
         })
         return filteredQuery
       }catch(err){
         console.log(err);
         return setResponse(err.statusCode,{
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
