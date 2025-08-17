import axios from "axios";

const whatsappAPI = "https://graph.facebook.com/v17.0"; // versão da API

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post(
      `${whatsappAPI}/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📩 Mensagem enviada via WhatsApp:", response.data);
  } catch (err) {
    console.error("❌ Erro ao enviar WhatsApp:", err.response?.data || err.message);
  }
};
