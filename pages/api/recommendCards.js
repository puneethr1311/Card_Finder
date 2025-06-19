// pages/api/recommendCards.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('Received request!');
  
  try {
    const { userProfile, availableCards } = req.body;
    console.log('Request body:', { userProfile, availableCards });

    // Validate required fields
    if (!userProfile || !availableCards) {
      return res.status(400).json({ 
        error: 'Missing required fields: userProfile and availableCards' 
      });
    }

    // Create a comprehensive prompt for OpenAI
    const prompt = `You are an expert credit card advisor with deep knowledge of Indian credit cards and financial products. Based on the user profile below, recommend the 3-4 best credit cards from the available options and provide detailed analysis.

User Profile:
- Name: ${userProfile.name || 'N/A'}
- Monthly Income: ${userProfile.monthlyIncome || 'N/A'}
- Spending Habits: ${JSON.stringify(userProfile.spendingHabits || {})}
- Preferred Benefits: ${JSON.stringify(userProfile.preferredBenefits || [])}
- Credit Score: ${userProfile.creditScore || 'N/A'}
- Existing Cards: ${userProfile.existingCards || 'None'}

Available Cards: ${JSON.stringify(availableCards, null, 2)}

Please analyze and score each card (0-100) based on:
1. Income compatibility and eligibility
2. Spending pattern alignment
3. Preferred benefits match
4. Credit score requirements
5. Value proposition (rewards vs fees)
6. Unique advantages for this user

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "name": "Card Name",
      "issuer": "Bank Name",
      "annual_fee": "Fee Amount",
      "joining_fee": "Fee Amount",
      "reward_rate": "Rate Details",
      "reward_type": "Type of Rewards",
      "special_perks": ["Perk 1", "Perk 2", "Perk 3"],
      "apply_link": "Application URL",
      "score": 95,
      "matchReasons": ["Reason 1", "Reason 2", "Reason 3"]
    }
  ],
  "explanation": "Brief explanation of why these specific cards were chosen based on the user's profile and spending patterns."
}

Consider the user's income level for card eligibility, match spending categories with reward categories, and prioritize cards that offer the benefits they specifically mentioned as important.`;

    console.log('Making OpenAI API call...');

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model
      messages: [
        {
          role: "system",
          content: "You are a professional credit card advisor specializing in Indian credit cards. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    console.log('OpenAI response received');

    // Parse the response
    const messageContent = completion.choices[0].message.content;
    console.log('Raw AI response:', messageContent);

    try {
      // Clean the response in case there are any markdown code blocks
      const cleanedContent = messageContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const aiResponse = JSON.parse(cleanedContent);
      
      // Validate the response structure
      if (!aiResponse.recommendations || !Array.isArray(aiResponse.recommendations)) {
        throw new Error('Invalid response structure: missing recommendations array');
      }

      // Ensure each recommendation has required fields
      const validatedRecommendations = aiResponse.recommendations.map(card => ({
        name: card.name || 'Unknown Card',
        issuer: card.issuer || 'Unknown Bank',
        annual_fee: card.annual_fee || '₹0',
        joining_fee: card.joining_fee || '₹0',
        reward_rate: card.reward_rate || '1%',
        reward_type: card.reward_type || 'Cashback',
        special_perks: Array.isArray(card.special_perks) ? card.special_perks : ['Standard benefits'],
        apply_link: card.apply_link || '#',
        score: Math.min(Math.max(card.score || 75, 0), 100), // Ensure score is between 0-100
        matchReasons: Array.isArray(card.matchReasons) ? card.matchReasons : ['Good overall match']
      }));

      const finalResponse = {
        recommendations: validatedRecommendations,
        explanation: aiResponse.explanation || 'These cards were selected based on your profile and spending patterns.'
      };

      console.log('Sending response:', finalResponse);
      return res.status(200).json(finalResponse);

    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.error('Raw content:', messageContent);
      
      // Fallback response if OpenAI response can't be parsed
      return res.status(200).json({
        recommendations: generateFallbackRecommendations(userProfile, availableCards),
        explanation: "I apologize, but I'm having trouble with my AI analysis right now. Here are some good recommendations based on your profile using my backup system."
      });
    }

  } catch (error) {
    console.error('Error in recommendCards API:', error);
    
    // Return fallback recommendations on any error
    return res.status(200).json({
      recommendations: generateFallbackRecommendations(req.body.userProfile, req.body.availableCards),
      explanation: "I'm experiencing technical difficulties with my AI analysis. Here are some recommended cards based on your profile."
    });
  }
}

// Fallback recommendation function
function generateFallbackRecommendations(userProfile, availableCards) {
  if (!availableCards || !Array.isArray(availableCards)) {
    return [];
  }

  // Score cards based on user profile
  const scoredCards = availableCards.map(card => {
    let score = 50; // Base score
    const reasons = [];

    // Income-based scoring
    if (userProfile?.monthlyIncome) {
      if (userProfile.monthlyIncome.includes('500000+') && card.annual_fee !== '₹0') {
        score += 15;
        reasons.push("Premium card suitable for high income");
      } else if (userProfile.monthlyIncome.includes('25000-50000') && card.annual_fee === '₹0') {
        score += 15;
        reasons.push("No annual fee perfect for your income level");
      }
    }

    // Benefits scoring
    if (userProfile?.preferredBenefits && Array.isArray(userProfile.preferredBenefits)) {
      userProfile.preferredBenefits.forEach(benefit => {
        if (card.reward_type?.toLowerCase().includes(benefit.toLowerCase()) || 
            card.special_perks?.some(perk => perk.toLowerCase().includes(benefit.toLowerCase()))) {
          score += 20;
          reasons.push(`Great ${benefit} benefits`);
        }
      });
    }

    // Spending habits scoring
    if (userProfile?.spendingHabits) {
      if (userProfile.spendingHabits.fuel !== 'none' && 
          (card.reward_type?.toLowerCase().includes('fuel') || 
           card.special_perks?.some(perk => perk.toLowerCase().includes('fuel')))) {
        score += 12;
        reasons.push("Excellent fuel rewards");
      }
      
      if (userProfile.spendingHabits.travel !== 'occasional' && 
          (card.reward_type?.toLowerCase().includes('travel') || 
           card.special_perks?.some(perk => perk.toLowerCase().includes('travel')))) {
        score += 12;
        reasons.push("Great for frequent travelers");
      }
    }

    return {
      ...card,
      score: Math.min(score, 100),
      matchReasons: reasons.length > 0 ? reasons : ['Good overall value proposition']
    };
  });

  // Sort by score and return top 4
  return scoredCards
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}