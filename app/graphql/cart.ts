/**
 * Cart GraphQL Mutations and Queries
 */

import { CART_FRAGMENT } from '../lib/fragments';

export const CART_CREATE = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_ADD_LINES = `
  mutation CartAddLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_UPDATE_LINES = `
  mutation CartUpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_REMOVE_LINES = `
  mutation CartRemoveLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_UPDATE_BUYER_IDENTITY = `
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export interface CartCreateVariables {
  input: {
    lines?: Array<{
      quantity: number;
      merchandiseId: string;
    }>;
    buyerIdentity?: {
      countryCode?: string;
      email?: string;
    };
  };
}

export interface CartAddLinesVariables {
  cartId: string;
  lines: Array<{
    quantity: number;
    merchandiseId: string;
  }>;
}

export interface CartUpdateLinesVariables {
  cartId: string;
  lines: Array<{
    id: string;
    quantity?: number;
  }>;
}

export interface CartRemoveLinesVariables {
  cartId: string;
  lineIds: string[];
}
