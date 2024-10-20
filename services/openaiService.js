import OpenAI from "openai";

// Creación de la instancia de OpenAI
const openai = new OpenAI(process.env.OPENAI_KEY);

// Creación del servicio de OpenAI para el chatbot

export const chatbotRutinas = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un instructor de fitness dedicado a la creación de diferentes rutinas segun las necesidades del usuario.",
        },
        { role: "user", content: message },
      ],
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error("Error al generar respuesta de OpenAI:", error);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
};
