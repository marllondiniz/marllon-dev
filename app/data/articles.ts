export type ArticleSource = {
  label: string;
  url: string;
};

export type Article = {
  slug: string;
  theme: string;
  title: string;
  excerpt: string;
  date: string;
  body: string[];
  sources?: ArticleSource[];
};

export const articles: Article[] = [
  {
    slug: "design-apis-rest-versionamento-contratos",
    theme: "Back-end e APIs",
    title: "Design de APIs REST: versionamento e contratos",
    excerpt:
      "Como versionar sua API sem quebrar clientes, usar OpenAPI e definir contratos que facilitam integrações e evolução do sistema.",
    date: "Fev 2025",
    body: [
      "Uma API bem desenhada evolui sem quebrar quem já consome. Versionamento na URL (/v1/...) ou no header (Accept-Version) são opções; o importante é ser consistente e documentar.",
      "Contratos em OpenAPI (Swagger) permitem gerar clientes, validar requests e manter front e back alinhados. Inclua exemplos de erro e códigos HTTP corretos (200, 201, 400, 404, 429).",
      "Evite quebrar mudando apenas o comportamento sem alterar a assinatura: novos campos opcionais são seguros; remover campos ou tornar obrigatório o que era opcional exige nova versão.",
    ],
    sources: [
      { label: "OpenAPI Specification", url: "https://spec.openapis.org/oas/latest.html" },
      { label: "REST API Versioning (Microsoft)", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design#versioning" },
    ],
  },
  {
    slug: "llms-fluxo-desenvolvimento",
    theme: "IA e LLMs",
    title: "LLMs no fluxo de desenvolvimento",
    excerpt:
      "Uso prático de modelos de linguagem para código: geração, revisão, testes e documentação, sem substituir o julgamento do dev.",
    date: "Fev 2025",
    body: [
      "LLMs ajudam a acelerar tarefas repetitivas: esboçar funções, escrever testes, comentar código e sugerir refators. O desenvolvedor revisa, ajusta contexto de negócio e decide o que sobe.",
      "Integre em pontos específicos do fluxo: no editor (autocomplete, explicação), no PR (sugestão de melhorias) ou em scripts (geração de boilerplate). Evite usar como caixa preta em lógica crítica.",
      "Mantenha prompts claros, com exemplos e restrições (linguagem, estilo, libs). Versionar prompts e medir qualidade das sugestões ajuda a evoluir o uso sem perder controle.",
    ],
    sources: [
      { label: "GitHub Copilot Documentation", url: "https://docs.github.com/en/copilot" },
      { label: "Anthropic – Building with Claude", url: "https://docs.anthropic.com/en/docs/build-with-claude" },
    ],
  },
  {
    slug: "webhooks-eventos-sistemas-desacoplados",
    theme: "Automação e integrações",
    title: "Webhooks e eventos: sistemas desacoplados",
    excerpt:
      "Quando usar webhooks em vez de polling, como garantir entrega e idempotência, e padrões para integrações entre sistemas.",
    date: "Jan 2025",
    body: [
      "Webhooks notificam o cliente quando algo acontece, em vez do cliente ficar perguntando (polling). Use para eventos pontuais; para fluxos contínuos ou muito frequentes, considere filas ou streams.",
      "Desenhe para falha: retries com backoff, idempotência (mesmo evento não processar duas vezes) e um endpoint de health. Inclua um id único por evento e assinatura (HMAC) para validar origem.",
      "Documente o formato do payload, os eventos disponíveis e os códigos HTTP. Um log de entregas (últimas N tentativas) ajuda o integrador a debugar sem depender do seu suporte.",
    ],
    sources: [
      { label: "Stripe – Webhooks", url: "https://docs.stripe.com/webhooks" },
      { label: "Webhook best practices (Svix)", url: "https://docs.svix.com/receiving/verifying-payloads/how" },
    ],
  },
  {
    slug: "escalando-back-end-filas-workers",
    theme: "Arquitetura de sistemas",
    title: "Escalando back-end: filas e workers",
    excerpt:
      "Offload de tarefas pesadas, filas com Redis ou RabbitMQ, e como desenhar workers resilientes para processamento assíncrono.",
    date: "Jan 2025",
    body: [
      "Tarefas que demoram ou não precisam ser síncronas (envio de e-mail, processamento de arquivo, notificações) cabem em filas. A API responde rápido e um worker processa em background.",
      "Redis (List/Streams) ou RabbitMQ são comuns: Redis é mais simples para volumes moderados; RabbitMQ entrega mais garantias e padrões (exchanges, dead-letter). Escolha conforme latência e durabilidade.",
      "Workers devem ser idempotentes, tratar falhas (retry, dead-letter) e expor métricas. Evite um único worker gigante: prefira vários consumidores e particione por tipo de tarefa se necessário.",
    ],
    sources: [
      { label: "Redis Streams", url: "https://redis.io/docs/data-types/streams/" },
      { label: "RabbitMQ – Queues", url: "https://www.rabbitmq.com/queues.html" },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}
