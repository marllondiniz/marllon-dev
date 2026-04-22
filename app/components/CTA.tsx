"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, Terminal } from "lucide-react";
import BlurText from "./BlurText";
import Magnet from "./Magnet";

export default function CTA() {
  return (
    <section id="contato" className="cyber-section data-stream border-t border-zinc-800/50 section-padding">
      <div className="section-container max-w-3xl text-center">
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
          text="Vamos colocar seu próximo passo no ar?"
          as="h2"
          animateBy="words"
          delay={100}
          stepDuration={0.4}
          className="justify-center font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white md:text-4xl [&>span:nth-child(n+4)]:text-[#22c55e] [&>span:nth-child(n+4)]:cyber-text-glow"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 font-mono text-sm text-zinc-400 terminal-cursor"
        >
          Escolha o serviço e preencha o briefing — respondo com a melhor forma de avançar.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-sm font-medium"
        >
          <span className="shiny-text" data-text="Atendimento no Espírito Santo e remoto">
            Atendimento no Espírito Santo e remoto
          </span>
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent"
          style={{ transformOrigin: "left" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-3"
        >
          <Magnet padding={60} magnetStrength={3}>
            <Link
              href="/briefing/escolher"
              className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-8 py-3.5 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.35)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            >
              <ClipboardList className="h-5 w-5" />
              Escolher briefing
            </Link>
          </Magnet>
          <p className="max-w-sm font-mono text-[10px] leading-relaxed text-zinc-600">
            No próximo passo você escolhe o serviço (tráfego, painéis ou site) e abre o formulário certo.
          </p>
        </motion.div>

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
