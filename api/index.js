const axios = require('axios');

export default async function handler(req, res) {
    // Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // Get Data from URL (GET) or Body (POST)
    const data = req.method === 'POST' ? req.body : req.query;

    const payload = {
        prompt: data.prompt || "A cinematic sunrise over mountains",
        model: data.model || "Seedance 1.5 Pro",
        duration: parseInt(data.duration) || 8,
        resolution: data.res || "720p",
        aspect_ratio: data.ratio || "16:9"
    };

    if (data.image || data.image_url) {
        payload.image_url = data.image || data.image_url;
    }

    try {
        // Call the inner API
        const response = await axios.post("https://zecora0.serv00.net/ai/Seedance.php", payload, {
            timeout: 50000 // Wait up to 50 seconds for the video
        });

        const result = response.data;
        result.developer = "Developed by Ramzan Ahsan";

        // Handle Direct Redirect
        if (data.direct && result.data && result.data.video_url) {
            return res.redirect(302, result.data.video_url);
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: "API Timeout or Connection Error",
            message: error.message 
        });
    }
}
