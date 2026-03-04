/**
 * Search GraphQL Queries
 */

import { SEARCH_PRODUCT_FRAGMENT } from '../lib/fragments';

export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int!, $after: String) {
    search(
      query: $query
      first: $first
      after: $after
      types: PRODUCT
    ) {
      nodes {
        ... on Product {
          ...SearchProductFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
`;

export const SEARCH_COLLECTIONS = `
  query SearchCollections($query: String!, $first: Int!) {
    search(
      query: $query
      first: $first
      types: COLLECTION
    ) {
      nodes {
        ... on Collection {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
      totalCount
    }
  }
`;

export interface SearchVariables {
  query: string;
  first: number;
  after?: string;
}
