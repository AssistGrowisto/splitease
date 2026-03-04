/**
 * Customer GraphQL Queries
 */

export const CUSTOMER_FRAGMENT = `
  fragment CustomerFragment on Customer {
    id
    email
    firstName
    lastName
    phone
    defaultAddress {
      id
      formattedArea
      address1
      address2
      city
      provinceCode
      country
      zip
    }
    addresses(first: 10) {
      edges {
        node {
          id
          address1
          address2
          city
          country
          provinceCode
          zip
        }
      }
    }
  }
`;

export const GET_CUSTOMER = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFragment
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

export const CUSTOMER_CREATE = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ...CustomerFragment
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

export const CUSTOMER_UPDATE = `
  mutation CustomerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        ...CustomerFragment
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

export const CUSTOMER_ADDRESSES_UPDATE = `
  mutation CustomerAddressUpdate(
    $customerAccessToken: String!
    $id: ID!
    $address: MailingAddressInput!
  ) {
    customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      customerAddress {
        id
        address1
        address2
        city
        country
        provinceCode
        zip
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
