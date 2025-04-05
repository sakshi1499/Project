
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const startConversation = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  return model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.7,
    },
  });
};
