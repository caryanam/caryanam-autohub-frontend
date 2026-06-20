import { Shield, Users, MapPin, Star, TrendingUp, Award } from "lucide-react";

const stats = [
  { label: "Cars Listed", value: "50,000+", icon: TrendingUp },
  { label: "Verified Dealers", value: "1,200+", icon: Shield },
  { label: "Cities Covered", value: "150+", icon: MapPin },
  { label: "Happy Customers", value: "2 Lakh+", icon: Users },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "Every vehicle listing goes through a rigorous verification process. No hidden costs, no surprises — just honest deals.",
  },
  {
    icon: Star,
    title: "Customer First",
    desc: "We put buyers and sellers at the center of everything we do. Our platform is built to make your journey smooth and stress-free.",
  },
  {
    icon: Award,
    title: "Quality Dealers",
    desc: "We partner only with certified dealerships who maintain high standards of service, ensuring you get the best experience every time.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    desc: "We constantly improve our platform with cutting-edge technology to give you the fastest, smartest car-buying experience in India.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-500/30">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            India's Most Trusted<br />
            <span className="text-blue-400">Used Car Marketplace</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AutoHub was founded with a single mission — to make buying and selling used cars in India simple, safe, and transparent. We connect lakhs of buyers with verified dealers across 150+ cities.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-5 leading-tight">
                Making Every Car Purchase<br />a Confident Decision
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                The used car market in India has historically been plagued by uncertainty — unknown vehicle history, inflated prices, and untrustworthy sellers. AutoHub was built to fix this.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                We built a platform where every listing is dealer-verified, pricing is transparent, and buyers can connect directly with sellers. Whether you're looking for your first car or upgrading your ride, AutoHub puts the power back in your hands.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story timeline */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">How We Got Here</h2>
        </div>
        <div className="mx-auto max-w-2xl relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200" />
          {[
            { year: "2020", title: "Founded in Mumbai", desc: "AutoHub started as a small team of 5 people with a big dream — to clean up the used car industry in India." },
            { year: "2021", title: "500 Dealers Onboarded", desc: "Rapid expansion across Maharashtra and Gujarat. Launched our dealer verification program." },
            { year: "2022", title: "Pan-India Expansion", desc: "Reached 100+ cities. Launched our mobile app and crossed 1 lakh listings on the platform." },
            { year: "2023", title: "1 Million Users", desc: "Milestone year — 10 lakh monthly active users, 1200+ verified dealers, and ₹500 Cr+ in transactions facilitated." },
            { year: "2024", title: "AI-Powered Features", desc: "Introduced smart price recommendations, instant loan pre-approvals, and personalized search powered by AI." },
          ].map((item, idx) => (
            <div key={item.year} className={`relative flex items-start gap-8 mb-12 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
              <div className="flex-1" />
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-lg">
                {item.year.slice(2)}
              </div>
              <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="text-blue-600 font-bold text-xs mb-1">{item.year}</div>
                <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white text-center px-4">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Find Your Next Car?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">Browse thousands of verified listings from trusted dealers across India.</p>
        <a
          href="/cars"
          className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Browse Cars
        </a>
      </section>
    </div>
  );
}
