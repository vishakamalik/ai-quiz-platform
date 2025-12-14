

export async function generateQuizQuestions(subDomainTitle) {
  const prompt = `
    Generate a strictly valid JSON array of 20 multiple-choice questions (MCQs) for the topic: "${subDomainTitle}".
    The difficulty should be mixed.
    The Output MUST be a raw JSON array. Do not include markdown formatting.
    Each object must have:
    {
      "id": 1,
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "Exact option string",
      "explanation": "Short explanation."
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${process.env.API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}