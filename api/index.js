const axios = require('axios');

export default async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Get Data
    const data = req.method === 'POST' ? req.body : req.query;

    // 3. Strict Parameter Mapping
    const model = data.model || "Seedance 1.5 Pro";
    const prompt = data.prompt || "A dramatic sunrise over mountains, camera slowly rising";
    const resolution = data.res || data.resolution || "720p";
    const aspect_ratio = data.ratio || data.aspect_ratio || "16:9";
    
    // Convert duration to Number and validate based on your rules
    let duration = parseInt(data.duration);
    if (model === "Seedance 1.5 Pro") {
        if (![4, 8, 12].includes(duration)) duration = 8;
    } else {
        if (![5, 10].includes(duration)) duration = 5;
    }

    // 4. Build Payload Exactly like the Documentation
    const payload = {
        "prompt": String(prompt),
        "model": String(model),
        "duration": Number(duration),
        "resolution": String(resolution),
        "aspect_ratio": String(aspect_ratio)
    };

    // Only add image_url if it actually exists (Don't send null)
    const image = data.image || data.image_url;
    if (image && image.trim() !== "") {
        payload.image_url = String(image);
    }

    try {
        // 5. POST to Seedance with strict headers
        const response = await axios({
            method: 'post',
            url: "https://zecora0.serv00.net/ai/Seedance.php",
            data: payload,
            headers: { 
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0" // Some servers block requests without a User-Agent
            },
            timeout: 55000 // Vercel timeout is roughly 60s, so we stop at 55s
        });

        const result = response.data;
        
        // Add your branding
        if (result) {
            result.developer = "Developed by Ramzan Ahsan";
        }

        // 6. Handle Direct Play
        if (data.direct && result.success && result.data && result.data.video_url) {
            return res.redirect(302, result.data.video_url);
        }

        return res.status(200).json(result);

    } catch (error) {
        // Log error for Vercel console
        console.error("Seedance Error:", error.response?.data || error.message);
        
        return res.status(500).json({ 
            success: false, 
            error: "Failed to communicate with Seedance",
            message: error.response?.data?.error || error.message,
            developer: "Developed by Ramzan Ahsan"
        });
    }
}
