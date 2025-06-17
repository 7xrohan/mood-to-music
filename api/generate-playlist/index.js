const { Configuration, OpenAIApi } = require("openai");

module.exports = async function (context, req) {
  const mood = req.body?.mood || "chill";

  const apiKey = process.env.OPENAI_API_KEY;
  context.log("🔑 OPENAI_API_KEY:", apiKey ? "found" : "NOT found");

  if (!apiKey) {
    context.res = {
      status: 500,
      body: { error: "OPENAI_API_KEY not set." }
    };
    return;
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Suggest 3 Spotify playlist titles with links based on this mood: "${mood}". Format as JSON array like [{ "name": "", "url": "" }]`
      }],
      temperature: 0.7
    });

    const text = response.data.choices[0].message.content;
    context.log("🧠 GPT raw:", text);

    const playlists = JSON.parse(text);
    context.res = {
      status: 200,
      body: playlists
    };

  } catch (err) {
    context.log("❌ GPT error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to fetch playlists." }
    };
  }
};
