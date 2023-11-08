import { GraphQL } from '../../../helpers';

export class SeawareApiClient {
  // Make from env
  static #seawareUrl = "http://dev.booking.aroya.com:3000/graphql";

  #graphQLClient = new GraphQL(SeawareApiClient.#seawareUrl);

  getAvailableVoyages(fromDate, toDate) {
    const queryObj = {
      queryName: "availableVoyages",
      params: {
        startDateRange: {
          from: fromDate,
          to: toDate,
        },
        endDateRange: {
          from: fromDate,
          to: toDate,
        }
      },
      fields: {
        pkg: {
          destinations: {
            name: true,
            key: true,
            comments: true,
          },
          vacation: {
            from: true,
          },
          location: {
            from: {
              name: true,
              code: true,
            },
          }
        }
      }
    };
    
    return this.#graphQLClient.query(queryObj);
  }
}
