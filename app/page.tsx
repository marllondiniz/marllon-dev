import { Mail, Linkedin, MapPin } from "lucide-react";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Content from "./components/Content";
import Partners from "./components/Partners";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <>
      <main itemScope itemType="https://schema.org/Person">
        <Hero />
        <About />
        <Partners />
        <Services />
        <Content />
        <CTA />
      </main>
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500" role="contentinfo">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-medium text-zinc-400">
            <span itemProp="name">Marllon Diniz</span> · zinid.tech
          </p>
          <address className="mt-1 not-italic">
            <span className="inline-flex items-center justify-center gap-1.5" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <MapPin className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              <span itemProp="addressRegion">Espírito Santo</span>, <span itemProp="addressCountry">Brasil</span>
            </span>
          </address>
          <nav className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Contato e redes sociais">
            <a 
              href="mailto:marllonzinid@gmail.com" 
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white"
              itemProp="email"
              aria-label="Email: marllonzinid@gmail.com"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              marllonzinid@gmail.com
            </a>
            <a 
              href="https://www.linkedin.com/in/marllon-diniz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white"
              itemProp="sameAs"
              aria-label="LinkedIn de Marllon Diniz"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
          </nav>
          <p className="mt-3 text-[#22c55e]/90 font-medium text-sm">
            Início de um futuro próspero
          </p>
          <p className="mt-2 text-zinc-500">
            <small>
              © {new Date().getFullYear()} Marllon Diniz · zinid.tech · Back-end · Web · Integrações · Automação · IA aplicada.
            </small>
          </p>
        </div>
      </footer>
    </>
  );
}
