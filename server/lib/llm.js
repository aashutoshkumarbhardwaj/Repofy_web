const getOpenRouterConfig = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    siteUrl: process.env.OPENROUTER_SITE_URL,
    appName: process.env.OPENROUTER_APP_NAME,
  };
};

export const generateText = async (prompt) => {
  const config = getOpenRouterConfig();
  if (!config) return null;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        ...(config.siteUrl ? { "HTTP-Referer": config.siteUrl } : {}),
        ...(config.appName ? { "X-Title": config.appName } : {}),
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `OpenRouter request failed (model: ${config.model}, status: ${response.status})`,
        errorBody
      );
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : null;
  } catch (error) {
    console.error(`OpenRouter request failed (model: ${config.model})`, error);
    return null;
  }
};
