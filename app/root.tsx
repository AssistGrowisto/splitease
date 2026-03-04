import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { json } from '@shopify/remix-oxygen';
import { Layout } from '~/components/layout/Layout';
import '~/styles/tailwind.css';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    storeName: 'Under Armour India',
  });
};

export default function App() {
  const { storeName } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-ua-light text-ua-dark">
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
