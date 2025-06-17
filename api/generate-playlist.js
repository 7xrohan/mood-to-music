const { OpenAI } = require("openai");

module.exports = async function (context, req) {
  const mood = req.body?.mood;

  if (!mood) {
    context.res = {
      status: 400,
      body: "Missing 'mood' in request.",
    };
    return;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const prompt = `Suggest 3 Spotify playlist names with public links based on this mood: "${mood}". Respond in JSON like:
    [
      {"name": "Chill Vibes", "url": "https://open.spotify.com/playlist/xyz"},
      {"name": "Energy Boost", "url": "https://open.spotify.com/playlist/abc"},
      {"name": "Late Night", "url": "https://open.spotify.com/playlist/def"}
    ]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = completion.choices[0].message.content;
    const parsed = JSON.parse(text);

    context.res = {
      headers: { "Content-Type": "application/json" },
      body: parsed,
    };
  } catch (error) {
    console.error("Error:", error);
    context.res = {
      status: 500,
      body: "Failed to generate playlists.",
    };
  }
};
