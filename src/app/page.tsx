import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Code,
  BarChart3,
  CreditCard,
  Search,
  Layout,
  Shield,
  Clock,
  CheckCircle2,
  Mail,
  type LucideIcon,
} from "lucide-react";

function Icon({ icon: IconComponent, className }: { icon: LucideIcon; className?: string }) {
  return <IconComponent className={className} />;
}

const services = [
  {
    icon: Layout,
    title: "Landing Pages",
    description: "High-converting pages that turn visitors into customers. Next.js, Tailwind, deployed same week.",
    price: "From $500",
  },
  {
    icon: Code,
    title: "Full-Stack Apps",
    description: "Dashboards, admin panels, internal tools. React, Node, Postgres — production-ready.",
    price: "From $1,500",
  },
  {
    icon: CreditCard,
    title: "Stripe Integration",
    description: "Subscriptions, one-time payments, invoicing, webhooks. We've wired dozens of Stripe setups.",
    price: "From $400",
  },
  {
    icon: Search,
    title: "SEO Audits",
    description: "Technical SEO, Core Web Vitals, schema markup, content strategy. Actionable, not theoretical.",
    price: "From $300",
  },
  {
    icon: BarChart3,
    title: "Data Dashboards",
    description: "Connect your data sources, visualize KPIs, automate reports. Supabase, Postgres, APIs.",
    price: "From $800",
  },
  {
    icon: Zap,
    title: "Bug Fixes & Rescue",
    description: "Broken deploy? Auth issues? Performance problems? We fix what others built.",
    price: "From $200",
  },
];

const process_steps = [
  {
    step: "01",
    title: "You describe the problem",
    description: "Send us a message. No calls, no meetings, no decks. Just tell us what you need.",
  },
  {
    step: "02",
    title: "We send a fixed quote",
    description: "Within 24 hours you get a scope, price, and timeline. No surprises, no hourly billing.",
  },
  {
    step: "03",
    title: "We build it",
    description: "Most projects ship in 3-7 days. You get progress updates. We handle deployment.",
  },
  {
    step: "04",
    title: "You review & launch",
    description: "One round of revisions included. We push to production. You're live.",
  },
];

const stats = [
  { value: "3-7", label: "Day delivery" },
  { value: "100%", label: "Fixed-price" },
  { value: "$0", label: "Until you're happy" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">LS</span>
            </div>
            <span className="font-semibold tracking-tight text-lg">
              LOVELEEDAY
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#process" className="hover:text-foreground transition-colors">Process</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <a href="#contact" className={buttonVariants({ size: "sm" })}>
              Start a Project <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-xs tracking-wider uppercase text-muted-foreground mb-6">
            Boutique Dev Studio — Fixed Price, Fast Delivery
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            We build what
            <br />
            you need,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
              fast.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Landing pages, dashboards, Stripe integrations, bug fixes, SEO audits.
            Small team. No overhead. No hourly billing. You get a fixed quote,
            we deliver in days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contact" className={buttonVariants({ size: "lg" }) + " text-base px-8 h-12"}>
                Get a Free Quote <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a href="#services" className={buttonVariants({ size: "lg", variant: "outline" }) + " text-base px-8 h-12 border-white/10"}>
              See What We Build
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl grid grid-cols-3 divide-x divide-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="py-8 md:py-10 text-center px-4">
              <div className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 md:py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What we build</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Fixed-price projects, delivered in days. No scope creep, no meetings that should have been emails.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon icon={service.icon} className="h-5 w-5 text-white/70" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{service.price}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 md:py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">
              No discovery calls. No sprint planning. No Jira.
            </p>
          </div>
          <div className="space-y-0">
            {process_steps.map((item, i) => (
              <div
                key={item.step}
                className="relative flex gap-6 py-8 group"
              >
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-sm font-mono text-muted-foreground group-hover:border-white/20 group-hover:text-foreground transition-colors">
                    {item.step}
                  </div>
                  {i < process_steps.length - 1 && (
                    <div className="w-px flex-1 bg-white/5 mt-4" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 md:py-32 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            Why teams choose us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Clock,
                title: "Speed over ceremony",
                description: "Most agencies take 2 weeks to schedule a kickoff. We'll have your first draft deployed before they send the SOW.",
              },
              {
                icon: Shield,
                title: "Fixed price, no surprises",
                description: "We quote before we start. If it takes us longer, that's our problem. You pay what we agreed on.",
              },
              {
                icon: CheckCircle2,
                title: "Production-ready code",
                description: "Not a prototype. Not a proof of concept. Deployed, tested, monitored. Your code runs on Vercel, Supabase, Stripe — real infrastructure.",
              },
              {
                icon: Code,
                title: "Full-stack, one team",
                description: "Frontend, backend, database, deployment, DNS, SSL, analytics. One team handles everything. No handoffs, no miscommunication.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon={item.icon} className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 md:py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Let&apos;s build something.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
            Tell us what you need. We&apos;ll reply within 24 hours with a scope,
            price, and timeline. No commitment, no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@loveleedaystudios.com" className={buttonVariants({ size: "lg" }) + " text-base px-8 h-12"}>
                <Mail className="mr-2 h-4 w-4" />
                hello@loveleedaystudios.com
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Or DM us on{" "}
            <a href="https://linkedin.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
              LinkedIn
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-white flex items-center justify-center">
              <span className="text-black font-bold text-[10px]">LS</span>
            </div>
            <span className="text-sm text-muted-foreground">
              LOVELEEDAY Studios LLC
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 LOVELEEDAY Studios LLC. A Delaware company.
          </p>
        </div>
      </footer>
    </main>
  );
}
