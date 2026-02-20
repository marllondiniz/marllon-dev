"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Terminal } from "lucide-react";
import BlurText from "./BlurText";
import Magnet from "./Magnet";

const EMAIL = "marllonzinid@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/marllon-diniz";

export default function CTA() {
  return (
    <section id="contato" className="cyber-section data-stream border-t border-zinc-800/50 section-padding">
      <div className="section-container max-w-3xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span className="hex-badge flicker">
            <Terminal className="h-3 w-3" />
            INIT://CONTACT_SESSION
          </span>
        </motion.div>

        <BlurText
          text="Quer construir algo que realmente escale?"
          as="h2"
          animateBy="words"
          delay={100}
          stepDuration={0.4}
          className="justify-center font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white md:text-4xl [&>span:nth-child(n+5)]:text-[#22c55e] [&>span:nth-child(n+5)]:cyber-text-glow"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 font-mono text-sm text-zinc-400 terminal-cursor"
        >
          Projetos, parcerias ou uma conversa técnica. Espírito Santo, Brasil.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-sm font-medium"
        >
          <span className="shiny-text" data-text="Início de um futuro próspero">
            Início de um futuro próspero
          </span>
        </motion.p>

        {/* Linha decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent"
          style={{ transformOrigin: "left" }}
        />

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnet padding={60} magnetStrength={3}>
            <a
              href={`mailto:${EMAIL}?subject=Contato Site`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            >
              <Mail className="h-5 w-5" />
              Falar comigo
            </a>
          </Magnet>
          <Magnet padding={60} magnetStrength={3}>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3.5 font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-[#22c55e]/50 hover:text-white hover:shadow-[0_0_16px_rgba(34,197,94,0.1)]"
            >
              <Linkedin className="h-5 w-5" />
              LinkedIn
            </a>
          </Magnet>
        </motion.div>

        {/* Rodapé técnico */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 font-mono text-[10px] uppercase tracking-widest text-zinc-700 flicker"
        >
          // session_ready · awaiting_connection
        </motion.p>
      </div>
    </section>
  );
}
