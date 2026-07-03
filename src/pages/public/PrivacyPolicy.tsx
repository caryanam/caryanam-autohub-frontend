import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import {
  Shield,
  Eye,
  Settings,
  Scale,
  Globe,
  Lock,
  Users,
  AlertTriangle,
  FolderOpen,
  Info,
  Key,
  ShieldAlert,
  RefreshCw,
  Mail,
  UserCheck
} from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Information Collection and Use",
    text: "The Application collects information when you download and use it. This information may include information such as:",
    points: [
      "Your device's Internet Protocol (IP) address",
      "The pages of the Application that you visit, the time and date of your visit, the time spent on those pages",
      "The time spent on the Application",
      "The operating system you use"
    ]
  },
  {
    icon: Eye,
    title: "Cookies and Tracking Technologies",
    text: "The Application or its third-party SDKs may use cookies, SDKs, pixels, and similar technologies to support functionality, analytics, or service delivery. Where required by applicable law, the Service Provider will obtain consent before using non-essential tracking technologies."
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    text: "You may request access to, correction of, or deletion of your personal data held by the Service Provider. To exercise these rights, or to withdraw consent where processing is based on consent, contact the Service Provider at support@caryanam.com."
  },
  {
    icon: Scale,
    title: "Your California Privacy Rights (CCPA/CPRA)",
    text: "If you are a California resident, you have the right to know what personal information is collected, the right to delete personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. To exercise your CCPA/CPRA rights, contact the Service Provider at support@caryanam.com.",
    extra: "The Service Provider may use the information you provide to send important information, required notices, and, where permitted by law, marketing communications. For a better experience while using the Application, the Service Provider may require you to provide certain personally identifiable information, including but not limited to support@caryanam.com. The information requested will be retained and used as described in this privacy policy."
  },
  {
    icon: Users,
    title: "Third Party Access",
    text: "Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement."
  },
  {
    icon: Globe,
    title: "International Data Transfers",
    text: "The Service Provider or its third-party service providers may transfer personal data to countries outside your country of residence, including outside the European Economic Area (EEA). Where applicable law requires safeguards for international transfers, the Service Provider will use appropriate mechanisms such as standard contractual clauses (SCCs) approved by the European Commission, adequacy decisions, or other legally recognized transfer mechanisms. Data protection laws in other countries may differ from those in your jurisdiction."
  },
  {
    icon: Info,
    title: "Third-Party Services",
    text: "Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:",
    links: [
      { label: "Google Play Services", href: "https://policies.google.com/privacy" },
      { label: "Facebook", href: "https://www.facebook.com/about/privacy/update" }
    ]
  },
  {
    icon: ShieldAlert,
    title: "Disclosure of Information",
    text: "The Service Provider may disclose User Provided and Automatically Collected Information:",
    points: [
      "As required by law, such as to comply with a subpoena, or similar legal process;",
      "When they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;",
      "With their trusted service providers who work on their behalf, do not have an independent use of the information the Service Provider discloses to them, and have agreed to adhere to the rules set forth in this privacy statement."
    ]
  },
  {
    icon: AlertTriangle,
    title: "Opt-Out Rights",
    text: "You can stop further collection of information from your device by ceasing to use the website. Ceasing to use will stop the website from collecting data from your device, but it does not automatically delete information that has already been transmitted to the Service Provider or to third parties. To request deletion of your personal data, to withdraw consent, or to exercise any of your rights, contact the Service Provider at support@caryanam.com."
  },
  {
    icon: FolderOpen,
    title: "Data Retention Policy",
    text: "The Service Provider retains personal data based on its necessity for the stated purposes:",
    points: [
      "User Provided Data: Retained for the duration of your use of the Application plus 12 months thereafter, unless longer retention is required by law",
      "Automatically Collected Data: Retained for up to 24 months from collection, unless longer retention is required for legal compliance",
      "Aggregated and Anonymized Data: Retained indefinitely as it no longer identifies you",
      "Data required for legal compliance: Retained as long as required by applicable law"
    ],
    extra: "You may request deletion of your personal data, subject to any legal obligation to retain it. If you want the Service Provider to delete User Provided Data submitted through the Application, please contact them at support@caryanam.com. Please note that some User Provided Data may be required for the Application to function properly."
  },
  {
    icon: Users,
    title: "Children's Privacy Protection",
    text: "The Application is not intended for children under 16 years of age, or such higher age as required by applicable law. The Service Provider does not knowingly solicit data from children or market the Application to them. In the event the Service Provider discovers that a child has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided the Service Provider with personal information, please contact the Service Provider (support@caryanam.com) so that they will be able to take the necessary actions."
  },
  {
    icon: Lock,
    title: "Data Security Safeguards",
    text: "The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains."
  },
  {
    icon: ShieldAlert,
    title: "Data Breach Notification",
    text: "If a data breach occurs that affects your personal data, the Service Provider will notify you in accordance with applicable legal requirements, including, where required, providing information about the nature of the breach and the steps being taken to address it."
  },
  {
    icon: RefreshCw,
    title: "Policy Changes & Revisions",
    text: "The Service Provider may update this Privacy Policy from time to time. The Service Provider will notify you of material changes by posting the updated Privacy Policy with an effective date. Where required by law, the Service Provider will seek your consent to material changes before they take effect. Previous versions of this Privacy Policy will be maintained and made available upon request by contacting the Service Provider at support@caryanam.com.",
    extra: "This privacy policy is effective as of 2026-07-02"
  },
  {
    icon: Key,
    title: "Your Consent & Affiliation",
    text: "Where processing is based on consent, you provide that consent by affirmatively opting in to the relevant feature or action. You may withdraw consent at any time without affecting processing carried out before withdrawal. Processing based on other lawful bases is carried out as described above."
  },
  {
    icon: Mail,
    title: "Contact Information",
    text: "If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at support@caryanam.com."
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy — Caryanam"
        description="At Caryanam, we respect your privacy and are committed to protecting your personal information. Read our Privacy Policy."
      />

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <span className="inline-block text-rose-900 text-4xl font-bold uppercase tracking-widest mb-4">
            Privacy Policy
          </span>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-5xl mx-auto">
            This privacy policy applies to the Caryanam app for web browsers, together with any related services operated by Caryanamindia pvt ltd (collectively, the "Application"). Caryanamindia pvt ltd is hereby referred to as the "Service Provider".
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
        {sections.map(({ icon: Icon, title, text, points, extra, links }, idx) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-7 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/15">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>

            {text && (
              <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                {text}
              </p>
            )}

            {points && (
              <ul className="space-y-2.5 mb-4">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-slate-600 text-[15px] leading-relaxed"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {extra && (
              <p className="text-slate-600 text-[15px] leading-relaxed mt-4 pt-4 border-t border-slate-50">
                {extra}
              </p>
            )}

            {links && (
              <div className="flex gap-4 mt-3">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-rose-900 font-bold hover:text-rose-950 transition-colors text-sm hover:underline"
                  >
                    {link.label} &rarr;
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
