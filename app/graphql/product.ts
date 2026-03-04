/**
 * Product GraphQL Queries
 */

import { PRODUCT_FRAGMENT } from '../lib/fragments';

export const GET_PRODUCT = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FRAGMENT.split('fragment ProductFragment on Product {')[1]}
  }
`;

export const GET_PRODUCTS = `
  query GetProducts($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
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

export const PRODUCT_RECOMMENDATIONS = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
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
`;

export interface ProductVariables {
  handle: string;
}

export interface ProductsVariables {
  first: number;
  query: string;
}

export interface ProductRecommendationsVariables {
  productId: string;
}
