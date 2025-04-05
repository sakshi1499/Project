
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const startConversation = async () => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.7,
      candidateCount: 1,
      topP: 0.8,
      topK: 40,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  });

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.7,
    },
  });

  return {
    chat,
    sendMessage: async (message: string) => {
      const result = await chat.sendMessageStream(message);
      return result;
    }
  };
};
