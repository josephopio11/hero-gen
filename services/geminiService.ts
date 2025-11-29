import { GoogleGenAI } from "@google/genai";
import { Gender } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to strip the data URL prefix if present
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateSuperheroScene = async (
  base64Image: string,
  gender: Gender,
  heroName: string,
  theme: string
): Promise<string> => {
  const ai = getClient();
  const cleanImage = cleanBase64(base64Image);

  const prompt = `
    Transform the person in this image into a superhero character named "${heroName}".
    
    Character Details:
    - Gender: ${gender}
    - Incorporate facial features from the source image so it resembles the user.
    - Outfit: High-tech, cinematic superhero suit suitable for a ${theme} movie.
    
    Scene:
    - Context: A blockbuster movie scene.
    - Theme: ${theme}.
    - Lighting: Dramatic, cinematic, volumetric lighting.
    - Quality: Photorealistic, 8k resolution, highly detailed texture.
    
    Output ONLY the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, or detect from string
              data: cleanImage
            }
          },
          { text: prompt }
        ]
      },
      config: {
        // Higher quality settings if possible
        temperature: 0.7,
      }
    });

    // Check for image in response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};