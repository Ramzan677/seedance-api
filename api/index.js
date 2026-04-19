const axios = require('axios');

export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Get Data from GET or POST
    const data = req.method === 'POST' ? req.body : req.query;

    let { 
        prompt = "A cinematic sunrise", 
        image = null, 
        ratio = "16:9", 
        model = "Seedance 1.5 Pro", 
        duration = 8, 
        res: resolution = "720p",
        direct = false 
    } = data;

    // 3. Validation Logic for Seedance Rules
    duration = parseInt(duration);
    if (model === "Seedance 1.5 Pro") {
        if (![4, 8, 12].includes(duration)) duration = 8;
    } else if (model.includes("1.0")) {
        if (![5, 10].includes(duration)) duration = 5;
    }

    // 4. Prepare Payload
    const payload = {
        prompt,
        model,
        duration,
        resolution,
        aspect_ratio: ratio
    };
    if (image || data.image_url) payload.image_url = image || data.image_url;

    try {
        // 5. Forward to Seedance
        const response = await axios.post("https://zecora0.serv00.net/ai/Seedance.php", payload);
        const result = response.data;

        if (result.success) {
            result.developer = "Developed by Ramzan Ahsan";
            
            // Audio Note
            if ((model === "Seedance 1.5 Pro" && duration !== 12) || model.includes("1.0")) {
                result.audio_note = "Note: No audio for this configuration.";
            }

            // Direct Redirect
            if (direct && result.data.video_url) {
                return res.redirect(302, result.data.video_url);
            }

            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "API connection failed" });
    }
}
