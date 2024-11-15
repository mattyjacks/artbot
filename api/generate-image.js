const axios = require('axios');

module.exports = async (req, res) => {
    // Allow all origins or specify one (for example, 'https://yourfrontend.com')
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your domain if you want to restrict access
    res.setHeader('Access-Control-Allow-Methods', 'POST'); // Allow POST requests

    // If it's a preflight OPTIONS request, respond with 200
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ensure it's a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // Ensure a prompt is provided in the body of the request
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        // Make the request to OpenAI's DALL·E 3 image generation API
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                model: "dall-e-3",  // Specify DALL·E 3 model
                prompt: prompt,  // The prompt provided by the user
                n: 1,  // Generate 1 image
                size: "1024x1024",  // Image size
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,  // Your OpenAI API key
                },
            }
        );

        // Log the response for debugging
        console.log('OpenAI API Response:', response.data);

        // Send back the image URL
        res.status(200).json({ imageUrl: response.data.data[0].url });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image.' });
    }
};
