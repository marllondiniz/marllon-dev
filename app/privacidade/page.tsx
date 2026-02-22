import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — zinid.tech",
  description: "Política de privacidade e uso de cookies do site zinid.tech.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl">
          Política de Privacidade
        </h1>
        <p className="mt-2 font-mono text-xs text-zinc-500">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

        <div className="mt-10 space-y-6 text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Responsável</h2>
            <p className="mt-2 leading-relaxed">
              O site zinid.tech é operado por Marllon Diniz. Para contato sobre privacidade: marllonzinid@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Dados coletados</h2>
            <p className="mt-2 leading-relaxed">
              Este site pode coletar dados técnicos (endereço IP, tipo de navegador, páginas visitadas) e informações que você enviar voluntariamente (por exemplo, ao preencher formulários de contato). O uso de cookies é informado no banner de consentimento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Cookies</h2>
            <p className="mt-2 leading-relaxed">
              Utilizamos cookies essenciais para o funcionamento do site e, com seu consentimento, podemos usar cookies analíticos. Sua preferência é armazenada localmente no seu dispositivo. Você pode alterar suas escolhas a qualquer momento limpando os dados do site no navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Finalidade e base legal</h2>
            <p className="mt-2 leading-relaxed">
              Os dados são utilizados para operar o site, responder contatos e, quando aplicável, para análises de acesso. O tratamento está amparado no seu consentimento (cookies) e no legítimo interesse (funcionamento do site), em conformidade com a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Seus direitos</h2>
            <p className="mt-2 leading-relaxed">
              Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados, além de revogar o consentimento. Entre em contato pelo e-mail indicado acima.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-zinc-500">
          <Link href="/" className="text-[#22c55e] hover:underline">
            Voltar ao início
          </Link>
        </p>
      </main>
    </div>
  );
}
