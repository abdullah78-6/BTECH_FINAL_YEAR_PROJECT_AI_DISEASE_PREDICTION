import {
  Activity,
  ShieldCheck,
  Brain,
  Mail,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-lime-500 text-white shadow-lg">
                <Activity size={24} strokeWidth={2.5} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  HealthPredict
                </h2>
                <p className="text-xs text-emerald-400">
                  Explainable AI for Healthcare
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Predict possible health conditions using machine learning
              and understand why AI made each prediction with Explainable AI.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck
                size={17}
                className="text-emerald-400"
              />
              Secure • Explainable • Reliable
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#home"
                  className="transition-colors hover:text-emerald-400"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#prediction"
                  className="transition-colors hover:text-emerald-400"
                >
                  Disease Prediction
                </a>
              </li>

              <li>
                <a
                  href="#explainable-ai"
                  className="transition-colors hover:text-emerald-400"
                >
                  Explainable AI
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="transition-colors hover:text-emerald-400"
                >
                  About Project
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Our Features
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Brain size={16} className="text-emerald-400" />
                AI-Based Diagnosis
              </li>

              <li className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                Health Prediction
              </li>

              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                Explainable Predictions
              </li>

              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                Secure & Private
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <p className="mb-4 text-sm leading-6 text-slate-400">
              Have questions about the project or want to learn more
              about our AI-powered healthcare system?
            </p>

            <a
              href="mailto:healthpredict@example.com"
              className="inline-flex items-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
            >
              <Mail size={17} />
              Contact Us
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} HealthPredict. All rights reserved.
          </p>

          <p className="flex items-center justify-center gap-1 sm:justify-end">
            Built with
            <span className="font-medium text-emerald-400">
              Machine Learning & Explainable AI
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;