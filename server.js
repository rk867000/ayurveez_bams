const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ⬇️⬇️⬇️ YOUR API KEY GOES IN .env FILE ⬇️⬇️⬇️
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// AI Chat endpoint for Gemini
app.post('/api/gemini-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Check if API key is properly set
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.json({
                text: "Hello! I'm Ayurveez AI Assistant. The AI service is currently being configured. For now, please use the regular chat support or contact us directly at WhatsApp: 9376884568.",
                isMock: true
            });
        }
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ text: message }] 
                    }],
                    system_instruction: {
                        parts: [{
                            text: `You are 'GuruJi AI', an Ayurvedic expert and BAMS study assistant for AYURVEEZ platform.
                            Your name is GuruJi AI Assistant.
                            You help BAMS students with Ayurvedic concepts, study tips, exam preparation, and course guidance.
                            
                            Guidelines:
                            1. Answer student queries about Ayurvedic medicine and BAMS curriculum
                            2. Be helpful, encouraging, and educational
                            3. If asked about treatments, provide educational information only with disclaimer
                            4. Keep answers clear and concise (2-3 paragraphs max)
                            5. Always mention that for personalized guidance, students should contact Dr. Ravi at 9376884568
                            6. Use simple English with occasional Sanskrit terms
                            7. For course enrollment questions, direct to WhatsApp support
                            8. Be positive and motivating about Ayurvedic studies`
                        }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                        topP: 0.8,
                        topK: 40
                    }
                })
            }
        );
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            res.json({ 
                text: data.candidates[0].content.parts[0].text,
                isMock: false
            });
        } else {
            res.json({
                text: "Namaste! I'm here to help with your Ayurvedic studies. For detailed questions about courses or payments, please contact our WhatsApp support at 9376884568.",
                isMock: true
            });
        }
        
    } catch (error) {
        console.error('AI Server error:', error);
        res.json({
            text: "I'm currently unavailable. Please contact our support team at WhatsApp: 9376884568 or email: ayurveez@gmail.com for immediate assistance.",
            isMock: true
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Ayurveez AI Backend' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ AI Server running on port ${PORT}`));
