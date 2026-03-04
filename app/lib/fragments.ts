/**
 * GraphQL Fragment Definitions
 * Reusable fragments for consistent API queries
 */

export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    vendor
    description
    descriptionHtml
    onlineStoreUrl
    tags
    totalInventory
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      nodes {
        id
        title
        handle
        sku
        barcode
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          altText
          width
          height
        }
        availableForSale
        selectedOptions {
          name
          value
        }
        quantityAvailable
      }
    }
    metafields(identifiers: []) {
      key
      value
      namespace
    }
  }
`;

export const COLLECTION_FRAGMENT = `
  fragment CollectionFragment on Collection {
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
    products(first: 20) {
      nodes {
        ...ProductFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const CART_LINE_FRAGMENT = `
  fragment CartLineFragment on CartLine {
    id
    quantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        title
        sku
        image {
          url
          altText
          width
          height
        }
        product {
          id
          title
          handle
          vendor
        }
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
      }
    }
  }
`;

export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        ...CartLineFragment
      }
    }
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`;

export const SEARCH_PRODUCT_FRAGMENT = `
  fragment SearchProductFragment on Product {
    id
    title
    handle
    vendor
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
`;
