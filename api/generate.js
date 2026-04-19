export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const body = req.body;

    const response = await fetch("https://zecora0.serv00.net/ai/Seedance.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Add your branding
    data.developer = "Developed by Ramzan Ahsan";

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
