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
  "Hola. Soy el asistente de conocimiento de NovaRetail. Puedes preguntarme sobre devoluciones, garantías, logística, reclamos, atención al cliente o procedimientos internos.";

const ENGLISH_GREETING_RESPONSE =
  "Hello. I am NovaRetail's knowledge assistant. You can ask me about returns, warranties, logistics, claims, customer service, or internal procedures.";

const SPANISH_THANKS_RESPONSE =
  "Con gusto. Si necesitas consultar otra política o procedimiento de NovaRetail, puedo ayudarte.";

const ENGLISH_THANKS_RESPONSE =
  "You're welcome. If you need to check another NovaRetail policy or procedure, I can help.";

const SPANISH_FAREWELL_RESPONSE =
  "Hasta luego. Si necesitas consultar otra política o procedimiento de NovaRetail, puedo ayudarte.";

const ENGLISH_FAREWELL_RESPONSE =
  "Goodbye. If you need to check another NovaRetail policy or procedure, I can help.";

const SPANISH_SHORT_RESPONSE =
  "Puedo ayudarte con preguntas sobre políticas, devoluciones, garantías, logística, reclamos, atención al cliente o procedimientos internos de NovaRetail.";

const ENGLISH_SHORT_RESPONSE =
  "I can help with questions about NovaRetail policies, returns, warranties, logistics, claims, customer service, or internal procedures.";

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
