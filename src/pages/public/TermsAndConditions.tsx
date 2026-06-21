import {
  FileText,
  ShoppingCart,
  AlertTriangle,
  Scale,
  Globe,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: ShoppingCart,
    title: "Use of the Platform",
    content: [
      "CAPL provides an online marketplace for buying and selling used vehicles in India. You may use our platform solely for lawful purposes.",
      "You must be at least 18 years of age to create an account or submit enquiries on CAPL.",
      "You agree not to misuse the platform for fraudulent listings, spam, harassment, or any activity that violates applicable laws.",
      "CAPL reserves the right to suspend or terminate accounts that violate these terms without prior notice.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    ],
  },
  {
    icon: FileText,
    title: "Dealer Listings & Responsibilities",
    content: [
      "Dealers are solely responsible for the accuracy, completeness, and legality of their vehicle listings.",
      "All vehicles listed must be legally owned and fit for sale. Listing stolen, encumbered, or misrepresented vehicles is strictly prohibited.",
      "CAPL performs verification checks on dealers but does not independently verify every listing detail. Buyers are encouraged to inspect vehicles before purchase.",
      "Dealers must not post misleading prices, fake images, or fabricated specifications.",
      "CAPL reserves the right to remove any listing that violates our content standards, without notice or liability.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Disclaimers & Limitation of Liability",
    content: [
      "CAPL is a marketplace platform and is NOT a party to any transaction between buyers and dealers.",
      "We do not guarantee the accuracy of vehicle listings, dealer representations, or the outcome of any transaction.",
      "CAPL is not responsible for any loss, damage, or dispute arising from a vehicle purchase or any interaction between users and dealers.",
      'Our platform is provided "as is" without warranties of any kind, express or implied, including fitness for a particular purpose.',
      "In no event shall CAPL's total liability exceed the amount, if any, paid by you to CAPL in the six months preceding the claim.",
    ],
  },
  {
    icon: Globe,
    title: "Intellectual Property",
    content: [
      "All content on CAPL — including the logo, design, text, graphics, and software — is the property of CAPL Technologies Pvt. Ltd. and protected by Indian copyright law.",
      "You may not copy, reproduce, distribute, or create derivative works from any part of the platform without written permission.",
      "Vehicle images uploaded by dealers remain the property of the respective dealers. By uploading, you grant CAPL a non-exclusive licence to display them on the platform.",
      "Trademarks of third-party brands mentioned on the site belong to their respective owners.",
    ],
  },
  {
    icon: Scale,
    title: "Governing Law & Disputes",
    content: [
      "These Terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.",
      "We encourage you to contact us first to resolve disputes amicably before pursuing legal action.",
      "If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.",
      "These Terms constitute the entire agreement between you and CAPL regarding use of the platform.",
    ],
  },
];

function renderLine(line: string) {
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

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-7 w-7 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using CAPL. By accessing or
            using our platform, you agree to be bound by these conditions.
          </p>
          <p className="text-slate-400 text-sm mt-4">Last updated: June 2024</p>
        </div>
      </section>

      {/* Acceptance banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-4">
        <p className="mx-auto max-w-4xl text-sm text-blue-700 text-center font-medium">
          By using CAPL, you agree to these Terms &amp; Conditions. If you do
          not agree, please do not use our platform.
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Intro */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Introduction
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            These Terms &amp; Conditions ("Terms") govern your access to and use
            of the CAPL platform, including our website, mobile applications,
            and all related services operated by{" "}
            <strong className="text-slate-900">
              CAPL Technologies Pvt. Ltd.
            </strong>{" "}
            ("CAPL", "we", "us", or "our"), registered in India.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            These Terms apply to all visitors, registered users, buyers, and
            dealers who access or use our platform in any manner.
          </p>
        </div>

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

        {/* Amendments */}
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Amendments</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            CAPL reserves the right to modify these Terms at any time. We will
            notify you of material changes via email or a prominent platform
            notice. Continued use of the platform following changes constitutes
            your acceptance of the updated Terms.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-8 text-white text-center">
          <Mail className="h-8 w-8 mx-auto mb-4 text-blue-300" />
          <h2 className="text-xl font-bold mb-2">
            Questions About These Terms?
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            Our team is happy to clarify anything. Reach out to us below.
          </p>
          <a
            href="mailto:legal@CAPL.in"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            legal@CAPL.in
          </a>
        </div>
      </div>
    </div>
  );
}
