const { Configuration, OpenAIApi } = require("openai");

module.exports = async function (context, req) {
  context.log("⚙️ Function triggered");

  try {
    const mood = req.body?.mood || "chill";
    context.log("🧠 Mood input:", mood);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      context.log("❌ Missing OPENAI_API_KEY");
      context.res = {
        status: 500,
        body: { error: "OPENAI_API_KEY not set in environment variables." }
      };
      return;
    }

    context.log("🔑 OPENAI_API_KEY found");

    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Suggest 3 Spotify playlist titles with links based on this mood: "${mood}". Format as JSON array like [{ "name": "", "url": "" }]`
        }
      ],
      temperature: 0.7
    });

    const text = response.data.choices[0].message.content;
    context.log("📨 GPT raw response:", text);

    const playlists = JSON.parse(text);
    context.res = {
      status: 200,
      body: playlists
    };
  } catch (err) {
    context.log("🔥 Function error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Something went wrong in the function: " + err.message }
    };
  }
};
