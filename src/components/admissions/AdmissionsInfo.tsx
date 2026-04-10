import { ClipboardList, FileText, Users, ArrowRight } from "lucide-react";

const sections = [
  {
    title: "Engineering Admission (B.Tech)",
    icon: ClipboardList,
    steps: [
      "Appear for JEE Main (for NITs/IIITs) or REAP (for state colleges)",
      "Register on REAP portal (dte.rajasthan.gov.in) during counseling period",
      "Fill choice form with preferred colleges and branches",
      "Attend counseling rounds (typically 3-4 rounds)",
      "Pay admission fee and report to allotted college",
      "Complete document verification at the college",
    ],
    eligibility: "10+2 with Physics, Chemistry, Mathematics with minimum 45% (40% for reserved categories)",
    exam: "REAP (Rajasthan Engineering Admission Process)",
  },
  {
    title: "Polytechnic Admission (Diploma)",
    icon: FileText,
    steps: [
      "Appear for PAT (Polytechnic Admission Test)",
      "Register on DTE Rajasthan portal for counseling",
      "Fill choice form with preferred colleges and branches",
      "Attend counseling rounds",
      "Pay fee and report to allotted college",
    ],
    eligibility: "10th pass with minimum 35% marks",
    exam: "PAT (Polytechnic Admission Test)",
  },
  {
    title: "Lateral Entry (Diploma to B.Tech)",
    icon: Users,
    steps: [
      "Complete diploma with minimum 45% marks",
      "Apply through REAP lateral entry counseling",
      "Get admission directly into 2nd year of B.Tech",
    ],
    eligibility: "Diploma holders with minimum 45% (40% for reserved)",
    exam: "Through REAP counseling",
  },
];

export function AdmissionsInfo() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Admissions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complete guide to engineering and polytechnic admissions in Rajasthan
        </p>
      </div>

      {/* Important dates card */}
      <div className="rounded-xl gradient-primary p-5 text-primary-foreground">
        <h2 className="font-heading font-semibold text-lg">📅 Key Dates (2025-26)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          <div>
            <p className="text-sm opacity-80">REAP Registration</p>
            <p className="font-semibold">June - July 2025</p>
          </div>
          <div>
            <p className="text-sm opacity-80">PAT Exam</p>
            <p className="font-semibold">May 2025</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Counseling Starts</p>
            <p className="font-semibold">July - August 2025</p>
          </div>
        </div>
      </div>

      {/* Process sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-heading font-semibold text-lg text-card-foreground">{section.title}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Eligibility</p>
                <p className="text-sm text-foreground mt-1">{section.eligibility}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Entrance Exam</p>
                <p className="text-sm text-foreground mt-1">{section.exam}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-card-foreground mb-2">Steps:</p>
              <ol className="space-y-2">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-card-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <p className="text-muted-foreground text-sm">
          Have questions about the admission process? Ask our AI assistant for personalized guidance.
        </p>
      </div>
    </div>
  );
}
