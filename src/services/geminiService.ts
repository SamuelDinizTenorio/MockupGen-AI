/**
 * @file geminiService.ts
 * Este arquivo contém a lógica para interagir com a API do Google Gemini
 * para gerar imagens de mockup.
 */

import { GoogleGenAI } from "@google/genai";
import { Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mapeia categorias em português para prompts específicos em inglês para evitar ambiguidade na geração.
const CATEGORY_PROMPTS: Record<Category, string> = {
  'Papelaria': 'Stationery set (notebook, letterhead, envelope, pen)',
  'Fachada': 'Storefront signage or building facade logo',
  'Embalagem': 'Product packaging box or pouch',
  'Camiseta': 'Cotton T-Shirt on a hanger or model',
  'Mobile': 'Smartphone screen display (iPhone or Android)',
  'Desktop': 'Desktop computer monitor workspace',
  'Tablet': 'Tablet screen display (iPad)',
  'Caneca': 'Ceramic coffee mug',
  'Sacola (Tote Bag)': 'Canvas tote bag',
  'Cartão de Visita': 'Business card stack'
};

/**
 * Gera um único mockup de imagem usando a API do Gemini.
 * @param {string} imageBase64 - A imagem do logo do usuário em formato Base64.
 * @param {string} mimeType - O tipo MIME da imagem (ex: 'image/png').
 * @param {Category} category - A categoria do mockup a ser gerado.
 * @param {string} description - A descrição textual para guiar o estilo da geração.
 * @returns {Promise<string>} Uma promessa que resolve com a URL da imagem gerada em formato Base64.
 * @throws {Error} Lança um erro se a geração falhar ou se a API retornar uma resposta inesperada.
 */
export const generateSingleMockup = async (
  imageBase64: string,
  mimeType: string,
  category: Category,
  description: string
): Promise<string> => {
  try {
    // Limpa a string base64 se ela tiver o prefixo "data:..."
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const targetObject = CATEGORY_PROMPTS[category] || category;

    const prompt = `
      ROLE: Professional Mockup Generator.
      TASK: Create a photorealistic product mockup of a ${targetObject}.
      
      CRITICAL INSTRUCTION:
      1. You are provided with an input image. You MUST use this exact image as the DESIGN/PRINT applied to the ${targetObject}.
      2. IGNORE the subject matter of the input image. Whether it is a photo of an animal, a landscape, a person, or text, treat it strictly as a FLAT VISUAL TEXTURE/DECAL.
      3. Do NOT refuse to generate because the image "doesn't look like a logo" or "doesn't fit the context". Your job is to force apply it.
      4. If the input is a rectangular photo, wrap it or place it on the surface naturally.
      
      STYLE/CONTEXT: ${description || 'Clean, minimal, high-end studio lighting, photorealistic, neutral background.'}
      
      OUTPUT: A single high-quality image of the ${targetObject} with the provided image applied to its main surface.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
           {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Itera pelas partes da resposta para encontrar a imagem gerada
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts || parts.length === 0) {
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason) {
        throw new Error(`Geração bloqueada pelo modelo. Motivo: ${finishReason}`);
      }
      throw new Error("O modelo não gerou conteúdo.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // Se nenhuma imagem foi encontrada, verifica se há uma parte de texto explicando o motivo.
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
        const msg = textPart.text.replace(/[*#]/g, '').trim();
        // Trunca mensagens muito longas para uma melhor exibição no card de erro
        const displayMsg = msg.length > 150 ? msg.substring(0, 150) + '...' : msg;
        throw new Error(`O modelo retornou texto: "${displayMsg}"`);
    }

    throw new Error("Nenhuma imagem encontrada na resposta.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error; // Relança o erro para que o componente que chamou a função possa tratá-lo.
  }
};