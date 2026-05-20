export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    const webhookUrl =
      process.env.DISCORD_WEBHOOK_URL;

    const response = await fetch(
      webhookUrl,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.log(
        "Discord Error:",
        errorText
      );

      return res.status(500).json({
        message:
          "Webhook gagal"
      });

    }

    return res.status(200).json({
      message:
        "Webhook berhasil"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message:
        "Server error"
    });

  }

}