/**
 * Collection GraphQL Queries
 */

import { PRODUCT_FRAGMENT } from './product';

export const COLLECTION_PRODUCTS = `
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        nodes {
          ...ProductFragment
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const COLLECTIONS_LIST = `
  query CollectionsList($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE = `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
    }
  }
`;

export interface CollectionVariables {
  handle: string;
  first: number;
  after?: string;
  sortKey?: string;
  reverse?: boolean;
  filters?: Array<{
    productType?: string;
    productVendor?: string;
    productMetafield?: {
      namespace: string;
      key: string;
      value: string;
    };
  }>;
}
