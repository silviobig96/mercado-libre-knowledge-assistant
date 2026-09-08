import type { ChatResponse } from "@/features/chat/types/chat.types";

type ConversationalIntent = "farewell" | "greeting" | "short" | "thanks";

type IntentResult =
  | {
      intent: "knowledge";
    }
  | {
      intent: ConversationalIntent;
      response: ChatResponse;
    };

const SPANISH_GREETING_RESPONSE =
  "Hola. Soy el asistente de conocimiento para operaciones de Mercado Libre Argentina. Puedes preguntarme sobre devoluciones, reembolsos, reclamos, Mercado Envíos, protección al comprador o procedimientos del marketplace incluidos en la base de conocimiento.";

const ENGLISH_GREETING_RESPONSE =
  "Hello. I am the knowledge assistant for Mercado Libre Argentina operations. You can ask about returns, refunds, claims, Mercado Envíos, buyer protection, or marketplace procedures covered by the knowledge base.";

const SPANISH_THANKS_RESPONSE =
  "Con gusto. Puedo ayudarte a consultar otra fuente aprobada sobre Marketplace o Mercado Envíos en Argentina.";

const ENGLISH_THANKS_RESPONSE =
  "You're welcome. I can help you check another approved Marketplace or Mercado Envíos source for Argentina.";

const SPANISH_FAREWELL_RESPONSE =
  "Hasta luego. Recuerda validar las fuentes y escalar cualquier caso ambiguo o sensible.";

const ENGLISH_FAREWELL_RESPONSE =
  "Goodbye. Remember to verify the sources and escalate any ambiguous or sensitive case.";

const SPANISH_SHORT_RESPONSE =
  "Puedo ayudarte con preguntas sobre devoluciones, reembolsos, reclamos, Mercado Envíos, protección al comprador y operaciones del marketplace incluidas en la base de conocimiento.";

const ENGLISH_SHORT_RESPONSE =
  "I can help with questions about returns, refunds, claims, Mercado Envíos, buyer protection, and marketplace operations covered by the knowledge base.";

const SPANISH_GREETINGS = new Set([
  "buenas",
  "buenas noches",
  "buenas tardes",
  "buenos dias",
  "buenos días",
  "hola",
]);

const ENGLISH_GREETINGS = new Set(["hello", "hi"]);
const SPANISH_THANKS = new Set(["gracias", "muchas gracias"]);
const ENGLISH_THANKS = new Set(["thank you", "thanks"]);
const SPANISH_FAREWELLS = new Set(["adios", "adiós"]);
const ENGLISH_FAREWELLS = new Set(["bye", "see you"]);

const MIN_KNOWLEDGE_WORDS = 3;

export function detectConversationIntent(input: string): IntentResult {
  const normalizedInput = normalizeInput(input);
  const language = detectLanguage(normalizedInput);

  if (SPANISH_GREETINGS.has(normalizedInput)) {
    return createConversationalResult("greeting", SPANISH_GREETING_RESPONSE);
  }

  if (ENGLISH_GREETINGS.has(normalizedInput)) {
    return createConversationalResult("greeting", ENGLISH_GREETING_RESPONSE);
  }

  if (SPANISH_THANKS.has(normalizedInput)) {
    return createConversationalResult("thanks", SPANISH_THANKS_RESPONSE);
  }

  if (ENGLISH_THANKS.has(normalizedInput)) {
    return createConversationalResult("thanks", ENGLISH_THANKS_RESPONSE);
  }

  if (SPANISH_FAREWELLS.has(normalizedInput)) {
    return createConversationalResult("farewell", SPANISH_FAREWELL_RESPONSE);
  }

  if (ENGLISH_FAREWELLS.has(normalizedInput)) {
    return createConversationalResult("farewell", ENGLISH_FAREWELL_RESPONSE);
  }

  if (isVeryShortNonQuestion(normalizedInput)) {
    return createConversationalResult(
      "short",
      language === "spanish" ? SPANISH_SHORT_RESPONSE : ENGLISH_SHORT_RESPONSE,
    );
  }

  return { intent: "knowledge" };
}

function createConversationalResult(
  intent: ConversationalIntent,
  answer: string,
): IntentResult {
  return {
    intent,
    response: {
      answer,
      confidence: null,
      sources: [],
    },
  };
}

function isVeryShortNonQuestion(input: string): boolean {
  const words = input.split(/\s+/).filter(Boolean);

  return words.length < MIN_KNOWLEDGE_WORDS && !input.includes("?");
}

function normalizeInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[!¡.]+$/g, "")
    .replace(/\s+/g, " ");
}

function detectLanguage(input: string): "english" | "spanish" {
  if (
    /[áéíóúñ¿]/i.test(input) ||
    /\b(que|qué|como|cómo|debo|puedo|necesito|reclamo|devolucion|devolución)\b/.test(
      input,
    )
  ) {
    return "spanish";
  }

  return "english";
}
