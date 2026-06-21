import {
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  RefreshCw,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "**Personal Information:** When you register or contact us, we may collect your name, email address, phone number, and city.",
      "**Vehicle Information:** If you are a dealer, we collect details about vehicles you list, including make, model, year, price, and images.",
      "**Usage Data:** We automatically collect information about how you interact with our platform, including pages visited, search queries, and time spent on listings.",
      "**Device Information:** We may collect device identifiers, browser type, and IP address for security and analytics purposes.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To provide, maintain, and improve our services and platform features.",
      "To connect buyers with verified dealers and facilitate vehicle enquiries.",
      "To send important service notifications, account updates, and (with your consent) promotional communications.",
      "To detect and prevent fraudulent activity, abuse, and unauthorized access.",
      "To analyze usage patterns and improve user experience across the platform.",
      "To comply with applicable laws and legal obligations.",
    ],
  },
  {
    icon: UserCheck,
    title: "Information Sharing",
    content: [
      "**With Dealers:** When you submit an enquiry, your contact details are shared with the relevant dealer to facilitate communication.",
      "**Service Providers:** We share data with trusted third-party providers (e.g., hosting, analytics, payment processing) who help us operate the platform.",
      "**Legal Requirements:** We may disclose your information if required by law, court order, or to protect the safety and rights of our users.",
      "We do NOT sell your personal data to third parties for marketing purposes.",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "We implement industry-standard security measures including SSL/TLS encryption, secure data storage, and access controls.",
      "All passwords are hashed using bcrypt and are never stored in plain text.",
      "We regularly review our security practices and update them to address evolving threats.",
      "Despite our best efforts, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your account credentials safe.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Cookies & Tracking",
    content: [
      "We use cookies and similar technologies to maintain your session, remember preferences, and understand how visitors use our site.",
      "Essential cookies are required for the platform to function and cannot be disabled.",
      "Analytics cookies help us understand site usage and improve our services. You can opt out via your browser settings.",
      "We do not use third-party advertising cookies or track you across other websites.",
    ],
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: [
      "**Access:** You have the right to request a copy of the personal data we hold about you.",
      "**Correction:** You can update or correct inaccurate information via your account settings.",
      "**Deletion:** You may request deletion of your account and associated data, subject to legal retention requirements.",
      "**Portability:** You can request your data in a structured, machine-readable format.",
      "To exercise any of these rights, contact us at privacy@CAPL.in.",
    ],
  },
];

function renderLine(line: string) {
  // Bold markdown (**text**)
  const parts = line.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-7 w-7 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            We are committed to protecting your privacy. This policy explains
            what data we collect, how we use it, and the choices you have.
          </p>
          <p className="text-slate-400 text-sm mt-4">Last updated: June 2024</p>
        </div>
      </section>

      {/* Intro banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-4">
        <p className="mx-auto max-w-4xl text-sm text-blue-700 text-center font-medium">
          This Privacy Policy applies to CAPL and all associated services. By
          using our platform, you agree to the collection and use of information
          as described below.
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {sections.map(({ icon: Icon, title, content }) => (
          <div
            key={title}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
            <ul className="space-y-3">
              {content.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{renderLine(line)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Children */}
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Children's Privacy
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our services are not directed to individuals under the age of 18. We
            do not knowingly collect personal data from minors. If you believe
            we have inadvertently collected data from a child, please contact us
            immediately at{" "}
            <a
              href="mailto:privacy@CAPL.in"
              className="text-blue-600 hover:underline"
            >
              privacy@CAPL.in
            </a>
            .
          </p>
        </div>

        {/* Changes */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Changes to This Policy
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by email or via a prominent notice on our
            platform. Continued use of CAPL after changes constitutes your
            acceptance of the updated policy.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-8 text-white text-center">
          <Mail className="h-8 w-8 mx-auto mb-4 text-blue-300" />
          <h2 className="text-xl font-bold mb-2">
            Questions About Your Privacy?
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            Our privacy team is here to help. Reach out to us anytime.
          </p>
          <a
            href="mailto:privacy@CAPL.in"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            privacy@CAPL.in
          </a>
        </div>
      </div>
    </div>
  );
}
