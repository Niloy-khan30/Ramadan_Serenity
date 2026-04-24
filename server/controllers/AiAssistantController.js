const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const askAiAssistant = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `
You are Ramadan Serenity's Islamic lifestyle assistant.

Your role:
- Answer questions about Ramadan, fasting, prayer, Islamic habits, duas, diet during fasting, and general Islamic lifestyle.
- Be respectful, calm, and beginner-friendly.
- Give practical advice.
- Do not claim to issue fatwas.
- For sensitive fiqh/ruling questions, say: "For a final ruling, please consult a qualified scholar or local imam."
- Mention that madhab opinions may differ when relevant.
- For medical/diet questions, give general wellness advice and tell users to consult a doctor for medical conditions.
- Avoid political, hateful, extremist, or sectarian content.
- Keep answers concise but helpful.
          `,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            temperature: 0.4,
            max_tokens: 500,
        });

        const reply =
            completion.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response right now.";

        return res.status(200).json({
            success: true,
            reply,
        });
    } catch (error) {
        console.error("AI assistant error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to get AI response",
            error: error.message,
        });
    }
};

module.exports = {
    askAiAssistant,
};