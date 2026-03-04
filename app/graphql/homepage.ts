/**
 * Homepage GraphQL Queries
 */

import { PRODUCT_FRAGMENT } from '../lib/fragments';

export const GET_HOMEPAGE_DATA = `
  query GetHomepageData {
    collections(first: 10) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
        }
      }
    }
    products(first: 8, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductFragment
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_FEATURED_PRODUCTS = `
  query GetFeaturedProducts($first: Int = 8) {
    products(
      first: $first
      sortKey: CREATED_AT
      reverse: true
      query: "tag:featured"
    ) {
      nodes {
        id
        title
        handle
        images(first: 1) {
          nodes {
            url
            altText
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      products(first: 8) {
        nodes {
          id
          title
          handle
          images(first: 1) {
            nodes {
              url
              altText
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
