const axios = require('axios');

export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Capture Data from URL or POST body
    const data = req.method === 'POST' ? req.body : req.query;

    // 3. Define the Correct Keys for Seedance API
    const prompt = data.prompt || "A dramatic sunrise over mountains";
    const model = data.model || "Seedance 1.5 Pro";
    const ratio = data.ratio || data.aspect_ratio || "16:9";
    const resolution = data.res || data.resolution || "720p";
    let duration = parseInt(data.duration);

    // 4. Force Duration Validation Rules
    if (model === "Seedance 1.5 Pro") {
        if (![4, 8, 12].includes(duration)) duration = 8;
    } else {
        if (![5, 10].includes(duration)) duration = 5;
    }

    // 5. Build the Exact Payload Seedance expects
    const payload = {
        "prompt": String(prompt),
        "model": model,
        "duration": duration,
        "resolution": resolution,
        "aspect_ratio": ratio
    };

    // Add image_url ONLY if provided (Important for Image-to-Video)
    const image = data.image || data.image_url;
    if (image) {
        payload.image_url = image;
    }

    try {
        // 6. Request to Seedance
        const response = await axios.post("https://zecora0.serv00.net/ai/Seedance.php", payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 60000 // Increase timeout for video generation
        });

        const result = response.data;
        
        // Add your branding to the output
        result.developer = "Developed by Ramzan Ahsan";

        // 7. Handle "Direct" play in browser
        if (data.direct && result.success && result.data.video_url) {
            return res.redirect(302, result.data.video_url);
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: "Connection to Seedance Failed",
            details: error.message 
        });
    }
}
