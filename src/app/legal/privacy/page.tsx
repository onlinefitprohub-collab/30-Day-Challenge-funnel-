import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FitPro Launch",
  description: "Privacy Policy for FitPro Launch — how we collect, use, and protect your data.",
};

const EFFECTIVE_DATE = "1 June 2025";
const COMPANY_NAME   = "FitPro Launch";
const CONTACT_EMAIL  = "hello@fitprolaunch.com";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Effective date: {EFFECTIVE_DATE}</p>

      <p className="mt-6 text-gray-400 leading-relaxed">
        {COMPANY_NAME} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy.
        This Privacy Policy explains what personal data we collect, how we use it, and your rights
        regarding that data. By using the Service, you agree to the practices described here.
      </p>

      <S title="1. Data Controller">
        <P>
          {COMPANY_NAME} is the data controller for personal data collected through the Service. Contact us at{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> with any questions about your data.
        </P>
      </S>

      <S title="2. Data We Collect">
        <H3>2.1 Account Data</H3>
        <P>When you register, we collect your full name, email address, and password (stored as a secure hash). If you sign up via Google, we receive your name and email from Google.</P>

        <H3>2.2 Coaching &amp; Business Data</H3>
        <P>To generate your funnel assets, you provide: business name, coach name, location, target audience, niche, offer details, testimonials, and marketing preferences. This data is used solely to generate your assets and is not sold or shared with third parties for marketing purposes.</P>

        <H3>2.3 Payment Data</H3>
        <P>
          Payments are processed by Stripe. We receive a Stripe customer ID and subscription status but do
          not store your card number, CVV, or bank details. Stripe&apos;s privacy policy governs all payment
          data: <A href="https://stripe.com/privacy">stripe.com/privacy</A>.
        </P>

        <H3>2.4 Usage Data</H3>
        <P>We automatically collect log data (IP address, browser type, pages visited, timestamps), device and connection information, feature usage patterns, and error logs.</P>

        <H3>2.5 Third-Party Integration Data</H3>
        <P>If you connect GoHighLevel, we store your GHL API key and Location ID in encrypted form. If you connect Notion, we store your integration token. You may disconnect any integration from account settings at any time.</P>
      </S>

      <S title="3. How We Use Your Data">
        <UL items={[
          "To provide the Service: generating AI assets, saving your projects, and processing your subscription.",
          "To communicate with you: sending account confirmations, receipts, product updates, and support responses.",
          "To improve the Service: analysing usage patterns to fix bugs and improve features. We do not use your coaching content to train AI models.",
          "To comply with legal obligations: retaining records as required by applicable law.",
          "To prevent fraud and abuse: monitoring for suspicious activity and enforcing our Terms of Service.",
        ]} />
      </S>

      <S title="4. AI Model Usage">
        <P>
          Your inputs are sent to Anthropic&apos;s Claude API to generate your marketing assets. Anthropic
          processes this data subject to their privacy policy. We do not permit Anthropic to use your data
          to train their models under our current API agreement. Anthropic&apos;s privacy policy:{" "}
          <A href="https://www.anthropic.com/privacy">anthropic.com/privacy</A>.
        </P>
      </S>

      <S title="5. Data Sharing and Disclosure">
        <P>We do not sell your personal data. We share data only:</P>
        <UL items={[
          "With service providers who process data on our behalf (Supabase for database hosting, Stripe for payments, Anthropic for AI generation, Vercel for hosting). All providers are contractually bound to protect your data.",
          "When required by law — for example, in response to a court order or regulatory request.",
          "In a business transfer — if FitPro Launch is acquired or merges, your data may be transferred. We will notify you before your data becomes subject to a different privacy policy.",
        ]} />
      </S>

      <S title="6. Cookies and Tracking">
        <P>
          We use essential cookies to maintain your session. We do not use third-party advertising or
          tracking cookies. We do not use Google Analytics, Facebook Pixel, or similar tracking scripts.
          Our hosting provider (Vercel) may set cookies for performance and security.
        </P>
      </S>

      <S title="7. Data Retention">
        <P>
          We retain your account and project data for as long as your account is active. If you delete
          your account, we will delete or anonymise your personal data within 30 days, except where
          legally required to retain it (e.g. payment records retained for 7 years under UK tax law).
        </P>
      </S>

      <S title="8. Data Security">
        <P>We implement industry-standard security measures including:</P>
        <UL items={[
          "TLS encryption for all data in transit",
          "Encrypted storage for sensitive credentials (API keys)",
          "Passwords hashed via Supabase Auth",
          "Row-level security policies on all database tables",
          "Access controls limiting employee access to personal data",
        ]} />
        <P>If we become aware of a data breach affecting your personal data, we will notify you within 72 hours as required by applicable law.</P>
      </S>

      <S title="9. Your Rights">
        <P>Depending on your location, you may have the right to:</P>
        <UL items={[
          "Access: request a copy of the personal data we hold about you.",
          "Rectification: ask us to correct inaccurate or incomplete data.",
          "Erasure: request deletion of your personal data ('right to be forgotten').",
          "Portability: request your data in a machine-readable format.",
          "Objection: object to processing of your data for certain purposes.",
          "Restriction: ask us to restrict processing in certain circumstances.",
          "Withdraw consent: where processing is based on consent, withdraw it at any time.",
        ]} />
        <P>
          To exercise these rights, email us at{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>. We will respond within 30 days. You
          may also lodge a complaint with the UK Information Commissioner&apos;s Office:{" "}
          <A href="https://ico.org.uk">ico.org.uk</A>.
        </P>
      </S>

      <S title="10. International Data Transfers">
        <P>
          Your data may be processed in countries outside your own, including the United States, where
          our service providers are based. Where we transfer data from the UK or EEA, we ensure
          appropriate safeguards are in place (such as Standard Contractual Clauses).
        </P>
      </S>

      <S title="11. Children's Privacy">
        <P>
          The Service is not directed at children under 18. We do not knowingly collect personal data
          from anyone under 18. Contact us if you believe a child has provided us with personal data
          and we will delete it promptly.
        </P>
      </S>

      <S title="12. Changes to This Policy">
        <P>
          We may update this Policy from time to time. We will notify you of material changes by email
          or by posting a notice in the Service. Continued use after changes constitutes acceptance of
          the revised policy.
        </P>
      </S>

      <S title="13. Contact Us">
        <P>
          For privacy-related questions or to exercise your rights:{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>
        </P>
        <P>{COMPANY_NAME} · fitprolaunch.com</P>
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

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 font-semibold text-gray-200">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-400 leading-relaxed">{children}</p>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="text-orange-400 hover:text-orange-300 underline" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{children}</a>;
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
