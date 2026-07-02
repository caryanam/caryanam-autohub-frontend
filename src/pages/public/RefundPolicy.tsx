import { ShieldAlert, FileX, RefreshCw, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";

const sections = [
  {
    icon: ShieldAlert,
    title: "All Payments Are Final",
    text: "All payments made to Caryanam are final and non-refundable.",
  },
  {
    icon: FileX,
    title: "Non-Refundable Services",
    text: "Once a payment has been successfully processed for any service, including vehicle booking, inspection, documentation, finance assistance, insurance assistance, or any other service, no refunds will be issued under any circumstances.",
  },
  {
    icon: RefreshCw,
    title: "Technical Errors & Duplicate Payments",
    text: "In the event of a duplicate payment or an incorrect deduction due to a technical error, the matter will be reviewed, and any eligible amount may be refunded at Caryanam's sole discretion.",
  },
  {
    icon: Mail,
    title: "Questions & Support",
    text: "If you have any questions regarding this policy, please contact our support team:",
    email: "support@caryanam.com",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-rose-50/30">
      <SEO
        title="Refund Policy — Caryanam"
        description="All payments made to Caryanam are final and non-refundable. Learn more about our Refund Policy."
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
            Refund Policy
          </span>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed mx-auto">
            Please read our refund policy details below regarding payments made for any of our services.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
        {sections.map(({ icon: Icon, title, text, email }, idx) => (
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

            <p className="text-slate-600 text-[15px] leading-relaxed">
              {text}
            </p>

            {email && (
              <div className="mt-4">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-rose-900 font-bold hover:text-rose-950 transition-colors"
                >
                  <Mail className="h-4 w-4" /> {email}
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
