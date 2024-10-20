import { chatbotRutinas } from "../../services/openaiService";

// Creación del controlador para el chat de rutinas
const chatIaRutinas = async (req, res) => {
  const { msgUsuario } = req.body;

  try {
    const respuestaChatbot = await chatbotRutinas(msgUsuario);
    res.json({ respuestaChatbot });
  } catch (error) {
    console.error("Error al generar respuesta de OpenAI:", error);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
};
