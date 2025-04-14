import axios from "axios";

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
const FALLBACK_RESPONSES = [
  "Sorry, please try again.",
  "AbleBot API Token expired...",
  "Server is busy right now... please try again later.",
];

export const handleChatbotMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: `User: ${message}\nAI:` },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        timeout: 20000,
      }
    );
  
    console.log("✅ HuggingFace Raw Response:", response.data);
    // console.log("🔐 HF_API_KEY:", process.env.HUGGINGFACE_API_KEY);
  
    if (response.data?.error) {
      console.error("❌ API returned error:", response.data.error);
    }
  
    const rawText = response.data[0]?.generated_text || "";
    const reply = rawText.split("AI:")[1]?.trim() || FALLBACK_RESPONSES[0];
  
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 HuggingFace API Error:", error.message);
    console.error("📦 Full Error:", error.response?.data || error);
  
    const randomFallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return res.status(200).json({ reply: randomFallback });
  }
  
};
