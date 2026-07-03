import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { FileText } from "lucide-react";

const terms = [
  "All information provided on the website must be accurate and complete.",
  "Caryanam reserves the right to modify, suspend, or discontinue any service without prior notice.",
  "Vehicle prices, availability, and specifications are subject to change without notice.",
  "Users are responsible for verifying all vehicle details before making any purchase or booking.",
  "Caryanam acts as a platform connecting buyers, sellers, and service providers and is not responsible for disputes between them.",
  "All payments made through the website are subject to our Refund Policy.",
  "Users must not misuse the website, upload false information, or engage in fraudulent activities.",
  "All website content, including logos, images, text, and trademarks, is the property of Caryanam and may not be copied without written permission.",
  "Caryanam shall not be liable for any direct or indirect loss arising from the use of this website or its services.",
  "These Terms & Conditions are governed by the laws of India, and any disputes shall be subject to the jurisdiction of the competent courts."
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Terms & Conditions — Caryanam"
        description="Welcome to Caryanam. Read our Terms & Conditions for accessing or using our website."
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
            Terms & Conditions
          </span>
          <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-5xl mx-auto">
            Welcome to Caryanam. By accessing or using our website, you agree to the following Terms &amp; Conditions:
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-7 sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/15">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Platform Usage Agreement</h2>
          </div>

          <ul className="space-y-4">
            {terms.map((term, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 text-slate-600 text-[15px] leading-relaxed"
              >
                <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                <span>{term}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-slate-100 text-center text-sm font-semibold text-slate-500 italic mt-6">
            By using this website, you acknowledge that you have read, understood, and agreed to these Terms &amp; Conditions.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
