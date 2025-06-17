const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function (context, req) {
  const mood = req.body?.mood || "chill";

  context.log("Incoming mood:", mood);

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
    context.log("GPT raw response:", text);

    const playlists = JSON.parse(text);
    context.res = {
      status: 200,
      body: playlists
    };

  } catch (error) {
    context.log.error("Function error:", error.message);
    context.res = {
      status: 500,
      body: { error: "Something went wrong on the server." }
    };
  }
};
