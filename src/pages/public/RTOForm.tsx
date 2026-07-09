import { motion } from "framer-motion";
import { SEO } from "@/components/shared/SEO";
import { FileText, Download } from "lucide-react";

const DOCUMENTS = [
  {
    id: "tto",
    title: "TTO Set 29-30",
    description: "Official RTO form for vehicle registration and transfer procedures. Contains all necessary paperwork for ownership transfer.",
    file: "TTO_Set_29-30.pdf"
  },
  {
    id: "purchase",
    title: "Professional Vehicle Purchase Form",
    description: "Comprehensive purchase agreement form outlining the terms, conditions, and details of the vehicle sale.",
    file: "Professional_Vehicle_Purchase_Form_A4.pdf"
  },
  {
    id: "delivery",
    title: "Car Delivery Note",
    description: "Official delivery note to acknowledge the handover of the vehicle, keys, and documents to the new owner.",
    file: "Car-Delivery-Note.pdf"
  }
];

export default function RTOForm() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28">
      <SEO
        title="RTO Forms & Documents | Caryanam"
        description="Download official RTO forms, purchase agreements, and delivery notes."
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
            Download the official RTO forms, purchase agreements, and delivery notes for vehicle registration and sales procedures.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DOCUMENTS.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8 text-center flex flex-col h-full"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-6">
                <FileText className="h-10 w-10 text-rose-600" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 mb-4">{doc.title}</h2>
              
              <p className="text-slate-600 text-[15px] leading-relaxed mb-8 flex-grow">
                {doc.description}
              </p>

              <a
                href={`/${doc.file}`}
                download={doc.file}
                className="inline-flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 w-full mt-auto"
              >
                <Download className="h-5 w-5" />
                Download Form
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
