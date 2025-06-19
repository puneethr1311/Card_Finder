// pages/chat.js
import { useState, useEffect, useRef } from 'react';

import Head from 'next/head';


export default function Chat() {




  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    monthlyIncome: '',
    spendingHabits: {
      fuel: '',
      travel: '',
      groceries: '',
      dining: '',
      shopping: '',
      other: ''
    },
    preferredBenefits: [],
    existingCards: [],
    creditScore: '',
    name: ''
  });
  const [cards, setCards] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const chatSteps = [
    {
      id: 'welcome',
      question: "Hello! I'm your AI-powered Credit Card Advisor 🤖\n\nI'll analyze your financial profile and spending patterns to recommend the perfect credit cards for you. Let's start with your name!",
      type: 'text',
      field: 'name'
    },
    {
      id: 'income',
      question: "What's your approximate monthly income? This helps me understand your eligibility for premium cards.",
      type: 'select',
      field: 'monthlyIncome',
      options: [
        { value: '25000-50000', label: '₹25,000 - ₹50,000', icon: '💼' },
        { value: '50000-100000', label: '₹50,000 - ₹1,00,000', icon: '💼' },
        { value: '100000-200000', label: '₹1,00,000 - ₹2,00,000', icon: '💰' },
        { value: '200000-500000', label: '₹2,00,000 - ₹5,00,000', icon: '💰' },
        { value: '500000+', label: '₹5,00,000+', icon: '🏆' }
      ]
    },
    {
      id: 'spending-fuel',
      question: "How much do you typically spend on fuel each month?",
      type: 'select',
      field: 'spendingHabits.fuel',
      options: [
        { value: '0-2000', label: '₹0 - ₹2,000', icon: '⛽' },
        { value: '2000-5000', label: '₹2,000 - ₹5,000', icon: '⛽' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000', icon: '🚗' },
        { value: '10000+', label: '₹10,000+', icon: '🚗' },
        { value: 'none', label: "I don't drive", icon: '🚶‍♂️' }
      ]
    },
    {
      id: 'spending-travel',
      question: "What's your monthly travel spending? (flights, hotels, booking platforms)",
      type: 'select',
      field: 'spendingHabits.travel',
      options: [
        { value: '0-5000', label: '₹0 - ₹5,000', icon: '🏠' },
        { value: '5000-15000', label: '₹5,000 - ₹15,000', icon: '✈️' },
        { value: '15000-30000', label: '₹15,000 - ₹30,000', icon: '🌍' },
        { value: '30000+', label: '₹30,000+', icon: '🏖️' },
        { value: 'occasional', label: 'Only occasional travel', icon: '🎒' }
      ]
    },
    {
      id: 'spending-groceries',
      question: "Monthly spending on groceries and essentials?",
      type: 'select',
      field: 'spendingHabits.groceries',
      options: [
        { value: '0-5000', label: '₹0 - ₹5,000', icon: '🛒' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000', icon: '🛍️' },
        { value: '10000-20000', label: '₹10,000 - ₹20,000', icon: '🏪' },
        { value: '20000+', label: '₹20,000+', icon: '🏬' }
      ]
    },
    {
      id: 'spending-dining',
      question: "How much do you spend on dining out and food delivery?",
      type: 'select',
      field: 'spendingHabits.dining',
      options: [
        { value: '0-2000', label: '₹0 - ₹2,000', icon: '🏠' },
        { value: '2000-5000', label: '₹2,000 - ₹5,000', icon: '🍽️' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000', icon: '🍕' },
        { value: '10000+', label: '₹10,000+', icon: '🍾' },
        { value: 'rarely', label: 'Rarely dine out', icon: '👨‍🍳' }
      ]
    },
    {
      id: 'benefits',
      question: "Which benefits are most important to you? Select all that apply to get personalized recommendations.",
      type: 'checkbox',
      field: 'preferredBenefits',
      options: [
        { value: 'cashback', label: 'Cashback on purchases', icon: '💰' },
        { value: 'travel', label: 'Travel rewards & miles', icon: '✈️' },
        { value: 'lounge', label: 'Airport lounge access', icon: '🛋️' },
        { value: 'fuel', label: 'Fuel rewards', icon: '⛽' },
        { value: 'shopping', label: 'Shopping discounts', icon: '🛍️' },
        { value: 'dining', label: 'Dining benefits', icon: '🍽️' },
        { value: 'movies', label: 'Movie tickets', icon: '🎬' },
        { value: 'insurance', label: 'Insurance coverage', icon: '🛡️' }
      ]
    },
    {
      id: 'existing-cards',
      question: "Do you currently have any credit cards? If yes, please mention which ones. (This is optional)",
      type: 'text',
      field: 'existingCards',
      optional: true
    },
    {
      id: 'credit-score',
      question: "What's your approximate credit score? This helps me recommend cards you're likely to get approved for.",
      type: 'select',
      field: 'creditScore',
      options: [
        { value: '750+', label: '750+ (Excellent)', icon: '🏆' },
        { value: '700-750', label: '700-750 (Good)', icon: '👍' },
        { value: '650-700', label: '650-700 (Fair)', icon: '👌' },
        { value: '600-650', label: '600-650 (Poor)', icon: '⚠️' },
        { value: 'unknown', label: "I don't know", icon: '❓' }
      ]
    }
  ];

  // Add a ref to track if initial message was sent
  const initialMessageSent = useRef(false);

  useEffect(() => {
    // Load credit cards data
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setCards(data.credit_cards || []);
      })
      .catch(error => console.error('Error loading cards:', error));

    // Start conversation with a slight delay for better UX
    // Add check to prevent duplicate initial messages
    if (!initialMessageSent.current && chatSteps[0]) {
      initialMessageSent.current = true;
      setTimeout(() => {
        addMessage(chatSteps[0].question, 'bot', chatSteps[0].options);
      }, 500);
    }
  }, []); // Keep empty dependency array

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text, sender, options = null) => {
    const message = {
      id: `${Date.now()}-${Math.random()}`, // More unique ID
      text,
      sender,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, message]);
  };

  const simulateTyping = (callback, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleUserResponse = (response, field = null) => {
    // Add user message
    addMessage(response, 'user');

    // Update user profile
    if (field) {
      setUserProfile(prev => {
        const newProfile = { ...prev };
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          newProfile[parent] = { ...newProfile[parent], [child]: response };
        } else if (field === 'preferredBenefits') {
          newProfile[field] = Array.isArray(response) ? response : [response];
        } else {
          newProfile[field] = response;
        }
        return newProfile;
      });
    }

    // Move to next step
    const nextStep = currentStep + 1;
    if (nextStep < chatSteps.length) {
      simulateTyping(() => {
        const step = chatSteps[nextStep];
        addMessage(step.question, 'bot', step.options);
        setCurrentStep(nextStep);
      });
    } else {
      // All questions answered, get recommendations
      simulateTyping(() => {
        addMessage("Perfect! Let me analyze your financial profile using AI to find the best credit cards tailored specifically for you... 🧠✨", 'bot');
        setTimeout(() => {
          getRecommendations();
        }, 2500);
      }, 800);
    }
  };
  const getRecommendations = async () => {
    try {
      setIsProcessing(true);
      setIsTyping(true);

      // Call your Python backend with OpenAI Assistant
      const response = await fetch('/api/recommendCards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: userProfile,
          availableCards: cards
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setIsProcessing(false);
      setIsTyping(false);

      addMessage(`Excellent news, ${userProfile.name}! 🎉\n\nBased on my AI analysis of your spending patterns and financial profile, I've identified ${data.recommendations.length} credit cards that are perfectly matched to your needs. Here are my personalized recommendations:`, 'bot');
      setShowRecommendations(true);

      // Add AI explanation if provided
      if (data.explanation) {
        setTimeout(() => {
          addMessage(`💡 **AI Insight:** ${data.explanation}`, 'bot');
        }, 1500);
      }

    } catch (error) {
      setIsProcessing(false);
      setIsTyping(false);
      console.error('Recommendation error:', error);
      addMessage("I apologize, but I'm experiencing some technical difficulties with my AI analysis. Let me provide you with some great recommendations based on your profile using my backup system.", 'bot');

      // Fallback to basic recommendation
      const fallbackRecommendations = await simulateRecommendationEngine();
      setRecommendations(fallbackRecommendations);
      setShowRecommendations(true);
    }
  };

  // Enhanced fallback recommendation engine
  const simulateRecommendationEngine = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let scored = cards.map(card => {
          let score = 0;
          let reasons = [];

          // Income-based scoring
          if (userProfile.monthlyIncome === '500000+' && card.annual_fee !== '₹0') {
            score += 15;
            reasons.push("Premium card suitable for high income");
          }
          if (userProfile.monthlyIncome.includes('25000-50000') && card.annual_fee === '₹0') {
            score += 15;
            reasons.push("No annual fee perfect for your income level");
          }

          // Benefits scoring
          userProfile.preferredBenefits.forEach(benefit => {
            if (card.reward_type.toLowerCase().includes(benefit) ||
              card.special_perks?.some(perk => perk.toLowerCase().includes(benefit))) {
              score += 20;
              reasons.push(`Great ${benefit} benefits`);
            }
          });

          // Spending habits scoring
          if (userProfile.spendingHabits.fuel !== 'none' &&
            (card.reward_type.toLowerCase().includes('fuel') ||
              card.special_perks?.some(perk => perk.toLowerCase().includes('fuel')))) {
            score += 12;
            reasons.push("Excellent fuel rewards");
          }

          if (userProfile.spendingHabits.travel !== 'occasional' &&
            (card.reward_type.toLowerCase().includes('travel') ||
              card.special_perks?.some(perk => perk.toLowerCase().includes('travel')))) {
            score += 12;
            reasons.push("Great for frequent travelers");
          }

          return { ...card, score, matchReasons: reasons };
        });

        scored.sort((a, b) => b.score - a.score);
        resolve(scored.slice(0, 4));
      }, 1500);
    });
  };

  const handleTextInput = (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      const currentStepData = chatSteps[currentStep];
      handleUserResponse(currentInput.trim(), currentStepData.field);
      setCurrentInput('');
    }
  };

  const handleSkip = () => {
    addMessage("⏭️ Skipped", 'user');
    const nextStep = currentStep + 1;
    if (nextStep < chatSteps.length) {
      simulateTyping(() => {
        const step = chatSteps[nextStep];
        addMessage(step.question, 'bot', step.options);
        setCurrentStep(nextStep);
      });
    }
  };

  const restartChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setUserProfile({
      monthlyIncome: '',
      spendingHabits: { fuel: '', travel: '', groceries: '', dining: '', shopping: '', other: '' },
      preferredBenefits: [],
      existingCards: [],
      creditScore: '',
      name: ''
    });
    setShowRecommendations(false);
    setRecommendations([]);
    setIsProcessing(false);
    setTimeout(() => {
      addMessage(chatSteps[0].question, 'bot');
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Find Your Perfect Card</title>
        <meta name="description" content="Get personalized credit card recommendations powered by AI. Analyze your spending patterns and find the perfect card for your lifestyle." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen pt-20 mt-20 bg-gradient-to-br from-blue-300 via-cyan-200 to-indigo-300">
        {/* Header */}
        <div className="px-20 py-5 flex items-center justify-between">
          <h1 className="text-black text-xl">
            Let's find which Credit Card best fit for you?
          </h1>

          <button
            onClick={restartChat}
            className="px-4 py-2 bg-black text-sm cursor-pointer text-gray-100 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            ↻ Start Over
          </button>
        </div>


        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden pt-16">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in opacity-0`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`flex items-end space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                      }`}>
                      {message.sender === 'user' ? '👤' : '🤖'}
                    </div>

                    {/* Message */}
                    <div
                      className={`px-6 py-4 rounded-2xl shadow-sm border ${message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-200'
                        : 'bg-white text-gray-900 border-gray-200/50'
                        }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{message.text}</p>

                      {/* Render options for bot messages */}
                      {message.sender === 'bot' && message.options && (
                        <div className="mt-4 space-y-3">
                          {chatSteps[currentStep]?.type === 'select' && (
                            <div className="space-y-2">
                              {message.options.map((option, optionIndex) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleUserResponse(option.value, chatSteps[currentStep].field)}
                                  className="w-full text-left px-4 py-3 bg-gray-50/80 hover:bg-blue-50 rounded-xl text-sm transition-all duration-200 border border-gray-200/50 hover:border-blue-200 group flex items-center space-x-3"
                                  style={{ animationDelay: `${optionIndex * 0.1}s`, animationFillMode: 'forwards' }}
                                >
                                  <span className="text-lg group-hover:scale-110 transition-transform">
                                    {option.icon}
                                  </span>
                                  <span className="font-medium">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {chatSteps[currentStep]?.type === 'checkbox' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {message.options.map((option, optionIndex) => (
                                  <label
                                    key={option.value}
                                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200/50 hover:border-blue-200"
                                    style={{ animationDelay: `${optionIndex * 0.05}s` }}
                                  >
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                      onChange={(e) => {
                                        const currentBenefits = userProfile.preferredBenefits || [];
                                        const newBenefits = e.target.checked
                                          ? [...currentBenefits, option.value]
                                          : currentBenefits.filter(b => b !== option.value);
                                        setUserProfile(prev => ({ ...prev, preferredBenefits: newBenefits }));
                                      }}
                                    />
                                    <span className="text-lg">{option.icon}</span>
                                    <span className="text-sm font-medium">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                              <button
                                onClick={() => handleUserResponse(userProfile.preferredBenefits, chatSteps[currentStep].field)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!userProfile.preferredBenefits?.length}
                              >
                                Continue with {userProfile.preferredBenefits?.length || 0} selected benefits →
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-end space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600">
                      🤖
                    </div>
                    <div className="bg-white text-gray-900 shadow-sm border border-gray-200/50 px-6 py-4 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        {isProcessing && (
                          <span className="text-sm text-gray-500 ml-3">
                            AI is analyzing your profile...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Recommendations */}
              {showRecommendations && recommendations.length > 0 && (
                <div className="space-y-6 animate-fade-in">
                  {recommendations.map((card, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{card.issuer}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full font-semibold shadow-sm">
                              {Math.round(card.score || 85)}% Match
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
                              {card.reward_type}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium border border-purple-200">
                              AI Recommended
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {card.reward_rate?.split(',')[0] || '2%'}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">Reward Rate</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50/50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 text-sm">Annual Fee:</span>
                          <span className="font-bold text-gray-900">{card.annual_fee || '₹0'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 text-sm">Joining Fee:</span>
                          <span className="font-bold text-gray-900">{card.joining_fee || '₹0'}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Why this card is perfect for you:
                        </h4>
                        <ul className="space-y-2">
                          {(card.special_perks || card.matchReasons || ['Great rewards program', 'Excellent customer service', 'Wide acceptance']).slice(0, 3).map((perk, perkIndex) => (
                            <li key={perkIndex} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-3 mt-0.5 text-lg">✓</span>
                              <span className="leading-relaxed">{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => window.open(card.apply_link || '#', '_blank')}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Apply Now →
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            {currentStep < chatSteps.length && chatSteps[currentStep]?.type === 'text' && (
              <div className="p-4 backdrop-blur-sm border-t border-gray-200/50">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center space-x-4 bg-white rounded-2xl shadow-lg border border-gray-200/50 p-2">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleTextInput}
                      placeholder="Type your answer and press Enter..."
                      className="flex-1 px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
                      disabled={isTyping}
                    />
                    {chatSteps[currentStep]?.optional && (
                      <button
                        onClick={handleSkip}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200"
                        disabled={isTyping}
                      >
                        Skip →
                      </button>
                    )}
                    <button
                      onClick={() => currentInput.trim() && handleUserResponse(currentInput.trim(), chatSteps[currentStep].field) & setCurrentInput('')}
                      disabled={!currentInput.trim() || isTyping}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Smooth transitions for all interactive elements */
        button, input, label {
          transition: all 0.2s ease-in-out;
        }

        /* Enhanced focus states */
        button:focus-visible, input:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Gradient text animation */
        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}