const axios = require('axios');

module.exports = async (req, res) => {
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

        // Send back the image URL
        res.status(200).json({ imageUrl: response.data.data[0].url });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image.' });
    }
};
