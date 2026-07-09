import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { FileText, Download } from "lucide-react";

export default function RTOForm() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28">
      <SEO
        title="RTO Form (TTO Set 29-30) | Caryanam"
        description="Download the official RTO form for vehicle registration and transfer procedures."
      />

      {/* Header */}
      <section className="relative overflow-hidden text-center px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-rose-900 text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4">
            RTO FORMS & DOCUMENTS
          </span>

          <p className="mt-4 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Download the official RTO form (TTO Set 29-30) for vehicle registration and transfer procedures.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8 sm:p-12 text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-rose-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">TTO Set 29-30</h2>
          
          <p className="text-slate-600 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
            This document contains all the necessary paperwork to ensure a smooth vehicle ownership transfer process.
          </p>

          <a
            href="/TTO_Set_29-30.pdf"
            download="TTO_Set_29-30.pdf"
            className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5"
          >
            <Download className="h-5 w-5" />
            Download Form
          </a>
        </motion.div>
      </div>
    </div>
  );
}
