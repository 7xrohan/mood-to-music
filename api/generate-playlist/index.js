const { OpenAI } = require("openai");

module.exports = async function (context, req) {
  const mood = req.body?.mood || "chill";

  const apiKey = process.env.OPENAI_API_KEY;

  context.log("🔑 OPENAI_API_KEY is:", apiKey ? "present" : "NOT FOUND");

  if (!apiKey) {
    context.res = {
      status: 500,
      body: { error: "OPENAI_API_KEY is not set in environment variables." }
    };
    return;
  }

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Suggest 3 Spotify playlist titles with links based on this mood: "${mood}". Format as JSON array like [{ "name": "", "url": "" }]`
      }],
      temperature: 0.7
    });

    const text = completion.choices[0].message.content;
    context.log("🧠 GPT raw response:", text);

    const playlists = JSON.parse(text);
    context.res = {
      status: 200,
      body: playlists
    };

  } catch (err) {
    context.log.error("❌ Error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Something went wrong." }
    };
  }
};
