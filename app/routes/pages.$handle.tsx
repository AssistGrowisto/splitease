import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { Breadcrumb } from '~/components/ui/Breadcrumb';

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { handle } = params;

  if (!handle) {
    throw new Response('Page not found', { status: 404 });
  }

  // Mock page data
  const pages: Record<string, any> = {
    privacy: {
      title: 'Privacy Policy',
      content: `
        <h2>Privacy Policy</h2>
        <p>At Under Armour, we are committed to protecting your privacy.</p>
        <h3>Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you make a purchase or create an account.</p>
        <h3>How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>
        <h3>Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@underarmour.in</p>
      `,
    },
    terms: {
      title: 'Terms of Service',
      content: `
        <h2>Terms of Service</h2>
        <p>Welcome to Under Armour's website. Please read these terms carefully.</p>
        <h3>Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</p>
        <h3>Disclaimer</h3>
        <p>The materials on Under Armour's website are provided on an 'as is' basis.</p>
      `,
    },
    about: {
      title: 'About Us',
      content: `
        <h2>About Under Armour</h2>
        <p>Under Armour is a global leader in sports-inspired athletic apparel, footwear, and accessories.</p>
        <h3>Our Mission</h3>
        <p>To make all athletes better through passion, design, and relentless pursuit of innovation.</p>
        <h3>Our Values</h3>
        <p>We are committed to authenticity, integrity, and excellence in everything we do.</p>
      `,
    },
    contact: {
      title: 'Contact Us',
      content: `
        <h2>Contact Us</h2>
        <h3>Customer Service</h3>
        <p>Email: support@underarmour.in</p>
        <p>Phone: 1800-XXX-XXXX</p>
        <h3>Address</h3>
        <p>Under Armour India<br/>New Delhi, India</p>
      `,
    },
  };

  const page = pages[handle] || {
    title: handle.charAt(0).toUpperCase() + handle.slice(1),
    content: '<p>Page content not found</p>',
  };

  return json({ page });
};

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-padding pt-6">
        <Breadcrumb
          items={[
            { label: 'HOME', href: '/' },
            { label: page.title.toUpperCase() },
          ]}
        />
      </div>

      {/* Page Content */}
      <div className="container-padding section-spacing">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-ua-dark mb-8 text-uppercase">
            {page.title}
          </h1>
          <div
            className="prose prose-invert max-w-none text-ua-grey"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
