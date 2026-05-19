import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | FitPro Launch",
  description: "Terms of Service for FitPro Launch — the AI business kit for online fitness coaches.",
};

const EFFECTIVE_DATE = "1 June 2025";
const COMPANY_NAME   = "FitPro Launch";
const CONTACT_EMAIL  = "hello@fitprolaunch.com";

export default function TermsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Effective date: {EFFECTIVE_DATE}</p>

      <p className="mt-6 text-gray-400 leading-relaxed">
        Please read these Terms of Service (&quot;Terms&quot;) carefully before using {COMPANY_NAME}
        (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account or
        using the Service, you agree to be bound by these Terms.
      </p>

      <S title="1. Description of Service">
        <P>
          {COMPANY_NAME} is a software-as-a-service platform that uses artificial intelligence to generate
          marketing assets for online fitness coaches, including but not limited to: landing page copy,
          email sequences, SMS messages, social media content, video sales letter scripts, and sales call
          scripts. Generated content is intended as a starting point and may require review and editing
          before use.
        </P>
      </S>

      <S title="2. Eligibility">
        <P>
          You must be at least 18 years old and capable of forming a legally binding contract to use the
          Service. By using the Service, you represent and warrant that you meet these requirements.
        </P>
      </S>

      <S title="3. Account Registration">
        <P>
          You must provide accurate, current, and complete information when creating your account. You are
          responsible for maintaining the confidentiality of your login credentials and for all activity
          that occurs under your account. You must notify us immediately at{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> if you suspect any unauthorised access.
        </P>
      </S>

      <S title="4. Subscription and Payment">
        <UL items={[
          "Access to " + COMPANY_NAME + " requires a paid subscription at the rate displayed at the time of purchase. Prices are in US dollars unless otherwise stated.",
          "Subscriptions are billed on a recurring monthly basis and renew automatically until cancelled.",
          "You may cancel at any time from your account settings. Cancellation takes effect at the end of the current billing period — you retain access until then and will not receive a pro-rated refund.",
          "All payments are processed securely by Stripe. We do not store your payment card details.",
          "We reserve the right to change our pricing with 30 days' notice. Continued use constitutes agreement to the new price.",
        ]} />
      </S>

      <S title="5. Refund Policy">
        <P>
          We offer a 7-day money-back guarantee on your first subscription payment. If you are not
          satisfied, contact us within 7 days of your initial payment at{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> and we will issue a full refund. After
          7 days, all payments are non-refundable.
        </P>
      </S>

      <S title="6. Acceptable Use">
        <P>You agree not to use the Service to:</P>
        <UL items={[
          "Generate content that is unlawful, harmful, defamatory, or misleading;",
          "Violate any applicable laws or regulations, including consumer protection and advertising standards;",
          "Infringe the intellectual property rights of any third party;",
          "Attempt to reverse engineer, decompile, or extract the underlying AI models or prompts;",
          "Resell or sublicense the Service or generated content as a competing AI copywriting tool;",
          "Use automated scripts or bots to make excessive API calls beyond normal usage.",
        ]} />
        <P>We reserve the right to suspend or terminate accounts that violate these terms without notice.</P>
      </S>

      <S title="7. Intellectual Property">
        <P><strong className="text-white">Your content:</strong> You retain all rights to the inputs you provide (your business information, niche, audience data, etc.).</P>
        <P><strong className="text-white">Generated content:</strong> You own the AI-generated assets produced for your account and may use them for any lawful commercial purpose.</P>
        <P><strong className="text-white">Our platform:</strong> {COMPANY_NAME}, its codebase, AI prompts, design, and all non-user-generated content remain our exclusive property and may not be reproduced without express written permission.</P>
      </S>

      <S title="8. AI-Generated Content Disclaimer">
        <P>
          Content generated by the Service is produced by AI language models and may contain inaccuracies
          or errors. You are solely responsible for reviewing all generated content before publishing or
          distributing it. {COMPANY_NAME} makes no warranty that generated content is accurate, complete,
          legally compliant, or fit for any particular purpose.
        </P>
        <P>Results will vary. Testimonials on our website represent individual experiences and do not guarantee equivalent outcomes.</P>
      </S>

      <S title="9. Third-Party Integrations">
        <P>
          The Service integrates with GoHighLevel, Stripe, Notion, and Google. Your use of those platforms
          is governed by their respective terms of service. We are not responsible for the availability,
          accuracy, or security of third-party services.
        </P>
      </S>

      <S title="10. Limitation of Liability">
        <P>
          To the fullest extent permitted by law, {COMPANY_NAME} and its officers, directors, employees,
          and agents shall not be liable for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of or inability to use the Service.
        </P>
        <P>Our total liability for any claim shall not exceed the amount you paid to us in the 3 months preceding the claim.</P>
      </S>

      <S title="11. Warranties Disclaimer">
        <P>
          The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether
          express or implied, including implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </P>
      </S>

      <S title="12. Indemnification">
        <P>
          You agree to indemnify and hold harmless {COMPANY_NAME} and its affiliates from any claims,
          damages, losses, and expenses (including reasonable legal fees) arising from your use of the
          Service, your violation of these Terms, or your violation of any rights of another party.
        </P>
      </S>

      <S title="13. Termination">
        <P>
          We may suspend or terminate your account at any time for violation of these Terms,
          non-payment, or any other reason at our sole discretion. Upon termination, your right to use
          the Service ceases immediately.
        </P>
      </S>

      <S title="14. Changes to These Terms">
        <P>
          We may update these Terms from time to time. We will notify you of material changes by email
          or by posting a notice on the Service. Continued use after changes are posted constitutes
          your acceptance of the revised Terms.
        </P>
      </S>

      <S title="15. Governing Law">
        <P>
          These Terms are governed by and construed in accordance with the laws of England and Wales.
          Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
        </P>
      </S>

      <S title="16. Contact Us">
        <P>
          If you have any questions about these Terms, please contact us at:{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>
        </P>
      </S>
    </div>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-400 leading-relaxed">{children}</p>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="text-orange-400 hover:text-orange-300 underline">{children}</a>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="text-gray-400 leading-relaxed">{item}</li>
      ))}
    </ul>
  );
}
