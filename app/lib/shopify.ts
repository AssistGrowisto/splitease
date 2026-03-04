import {
  createStorefrontClient,
  type StorefrontClient,
} from '@shopify/hydrogen-react';

interface ShopifyConfig {
  storeDomain: string;
  storefrontToken: string;
  apiVersion?: string;
}

/**
 * Initialize Shopify Storefront API client
 */
export function createShopifyClient(config: ShopifyConfig): StorefrontClient {
  const apiVersion = config.apiVersion || '2024-01';

  return createStorefrontClient({
    storeDomain: config.storeDomain,
    publicAccessToken: config.storefrontToken,
    apiVersion,
  });
}

/**
 * Helper to make Storefront API requests
 */
export async function storefrontFetch<T = any>(
  query: string,
  variables?: Record<string, any>,
  context?: any,
): Promise<T> {
  const storeDomain = context?.PUBLIC_STORE_DOMAIN || process.env.PUBLIC_STORE_DOMAIN;
  const token = context?.PUBLIC_STOREFRONT_API_TOKEN || process.env.PUBLIC_STOREFRONT_API_TOKEN;

  if (!storeDomain || !token) {
    throw new Error('Missing Shopify environment variables');
  }

  const response = await fetch(
    `https://${storeDomain}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

/**
 * Format currency for INR
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
}

/**
 * Format currency with rupee symbol
 */
export function formatPrice(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${Math.round(numAmount).toLocaleString('en-IN')}`;
}
