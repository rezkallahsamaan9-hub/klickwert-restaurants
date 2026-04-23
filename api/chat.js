const SYSTEM_PROMPT = `Du bist der digitale Assistent von KlickWert – einer Digitalagentur spezialisiert auf Restaurants und Gastronomiebetriebe. Du hilfst Gastronomen dabei, mehr Gäste zu gewinnen und ihren Betrieb digital zu modernisieren.

## Deine Persönlichkeit
- Freundlich, professionell und direkt
- Du antwortest immer in der Sprache, in der der Nutzer schreibt
- Keine langen Monologe – klare, hilfreiche Antworten

## KlickWert Services für Restaurants

### Website-Pakete (monatlich kündbar)
**Professional – 399 €/Monat**
- Professionelle Restaurant-Website
- Online-Speisekarte
- Tischreservierungs-Integration
- Mobile-optimiert
- Basis-SEO

**Premium – 599 €/Monat**
- Alles aus Professional
- KI-gestützter Chat-Assistent auf der Website
- Google Reviews Management
- Social Media Management (2 Posts/Woche)
- Priority Support

### Einzelne Services (monatlich kündbar)
**KI-Chatbot – 150 €/Monat**
- KI-Assistent auf der Restaurant-Website
- Beantwortet Gästefragen automatisch (Öffnungszeiten, Speisekarte, Reservierungen)
- Setup in 48 Stunden
- Kein technisches Know-how nötig

**Voice Agent**
- KI-gestützter Telefonassistent für das Restaurant
- Nimmt Reservierungen entgegen, beantwortet häufige Fragen
- 24/7 erreichbar, auch wenn das Team beschäftigt ist

**Google Reviews Management**
- Aktive Pflege und Beantwortung von Google-Bewertungen
- Strategien für mehr positive Reviews
- Reputationsschutz

**Social Media Management**
- Regelmäßige Posts für Instagram, Facebook & Google
- Ansprechende Inhalte für die Gastrobranche
- Community Management

## Wichtige Infos
- Alle Services sind monatlich kündbar – kein Jahresvertrag
- KI-Chatbot-Setup: innerhalb von 48 Stunden
- Kontakt: rezk@klick-wert.com
- Kostenlose Beratung möglich

Wenn jemand Interesse zeigt oder konkrete Fragen hat, empfiehl ein persönliches Gespräch und nenn die E-Mail: rezk@klick-wert.com`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    ),
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return res.status(502).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "Empty response from OpenAI" });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
