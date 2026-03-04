import { createRequestHandler } from '@shopify/remix-oxygen';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import * as RemixBuild from '@remix-run/server-runtime';
import { getStorefrontHeaders } from '@shopify/remix-oxygen';

type AssetEvent = FetchEvent & { request: { url: string } };

const handleAsset = async (event: AssetEvent) => {
  try {
    return await getAssetFromKV(event as any);
  } catch (error) {
    let errorMessage = String(error);
    if (
      errorMessage.includes('ENOENT') ||
      errorMessage.includes('file not found')
    ) {
      return new Response('Not Found', { status: 404 });
    }
    return new Response(errorMessage, { status: 500 });
  }
};

const handleRequest = createRequestHandler({
  build: RemixBuild,
  mode: process.env.NODE_ENV,
  getLoadContext: (context: any) => {
    const { queryShop } = getStorefrontHeaders(context.request.headers);

    return {
      queryShop,
      waitUntil: context.waitUntil.bind(context),
    };
  },
});

export default {
  async fetch(
    request: Request,
    env: Record<string, string>,
    context: ExecutionContext,
  ): Promise<Response> {
    try {
      if (request.method === 'GET') {
        const url = new URL(request.url);
        if (
          url.pathname.startsWith('/build/') ||
          url.pathname.startsWith('/favicon')
        ) {
          return handleAsset({ request, ...context } as AssetEvent);
        }
      }

      return await handleRequest(request, {
        ...env,
        context,
      });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
