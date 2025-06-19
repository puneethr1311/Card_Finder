// pages/cards.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Compare functionality state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Sample card images mapping - you can replace these with actual card images
  const cardImages = {
    'HDFC Bank Regalia Gold Credit Card': '/images/cards/hdfc-regalia-gold.jpg',
    'SBI Card PRIME': '/images/cards/sbi-prime.jpg',
    'ICICI Bank Amazon Pay Credit Card': '/images/cards/icici-amazon.jpg',
    'Axis Bank Magnus Credit Card': '/images/cards/axis-magnus.jpg',
    'American Express Platinum Card': '/images/cards/amex-platinum.jpg',
    // Add more mappings as needed
  };

  const categories = [
    { id: 'all', name: 'All Cards', icon: '🏦' },
    { id: 'cashback', name: 'Cashback', icon: '💰' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'rewards', name: 'Rewards', icon: '🎁' },
    { id: 'fuel', name: 'Fuel', icon: '⛽' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' }
  ];

  useEffect(() => {
    // Fetch data from public/data.json
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setCards(data.credit_cards || []);
        setFilteredCards(data.credit_cards || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = cards;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = cards.filter(card => 
        card.reward_type.toLowerCase().includes(selectedCategory) ||
        card.best_suited_for.some(category => 
          category.toLowerCase().includes(selectedCategory)
        )
      );
    }

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'annual_fee':
          return parseFloat(a.annual_fee.replace(/[₹,]/g, '') || '0') - 
                 parseFloat(b.annual_fee.replace(/[₹,]/g, '') || '0');
        case 'reward_rate':
          return parseFloat(b.reward_rate.match(/\d+/)?.[0] || '0') - 
                 parseFloat(a.reward_rate.match(/\d+/)?.[0] || '0');
        default:
          return 0;
      }
    });

    setFilteredCards(filtered);
  }, [cards, selectedCategory, sortBy]);

  // Compare functionality
  const addToCompare = (card) => {
    if (compareList.length >= 3) {
      alert('You can compare up to 3 cards at a time');
      return;
    }
    if (compareList.find(c => c.name === card.name)) {
      alert('Card already added to comparison');
      return;
    }
    setCompareList([...compareList, card]);
  };

  const removeFromCompare = (cardName) => {
    setCompareList(compareList.filter(card => card.name !== cardName));
  };

  const clearCompareList = () => {
    setCompareList([]);
  };

  const isInCompareList = (cardName) => {
    return compareList.some(card => card.name === cardName);
  };

  // Enhanced Compare Modal Component
  const CompareModal = () => {
    if (!showCompareModal || compareList.length === 0) return null;

    const compareFeatures = [
      { key: 'issuer', label: 'Issuer', icon: '🏛️' },
      { key: 'reward_type', label: 'Reward Type', icon: '🎯' },
      { key: 'reward_rate', label: 'Reward Rate', icon: '📈' },
      { key: 'joining_fee', label: 'Joining Fee', icon: '💳' },
      { key: 'annual_fee', label: 'Annual Fee', icon: '💰' },
      { key: 'income_requirement', label: 'Income Requirement', icon: '💼' },
    ];

    const getFeatureValue = (card, key) => {
      if (Array.isArray(card[key])) {
        return card[key].join(', ');
      }
      return card[key] || 'N/A';
    };

    const getFeeColorClass = (fee) => {
      if (fee === 'Free' || fee === '₹0' || fee.includes('Waived')) {
        return 'text-green-600 font-semibold';
      }
      return 'text-gray-900';
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Compare Credit Cards</h2>
                <p className="text-blue-100 mt-1">Side-by-side comparison of {compareList.length} cards</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Cards Header Row */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
              <div className="grid grid-cols-4 gap-6 p-6">
                <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
                  Features
                </div>
                {compareList.map((card, index) => (
                  <div key={index} className="text-center">
                    <div className="relative">
                      {/* Card Visual */}
                      <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                        <div className="relative text-white text-center z-10">
                          <div className="w-8 h-5 bg-white/30 rounded-sm mx-auto mb-1"></div>
                          <div className="text-[10px] font-medium opacity-90">PREMIUM</div>
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCompare(card.name)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">{card.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="p-6">
              <div className="space-y-1">
                {compareFeatures.map((feature, featureIndex) => (
                  <div 
                    key={feature.key} 
                    className={`grid grid-cols-4 gap-6 py-4 px-4 rounded-lg ${
                      featureIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } border border-gray-100`}
                  >
                    {/* Feature Label */}
                    <div className="flex items-center space-x-2 font-semibold text-gray-700">
                      <span className="text-lg">{feature.icon}</span>
                      <span>{feature.label}</span>
                    </div>
                    
                    {/* Feature Values */}
                    {compareList.map((card, cardIndex) => (
                      <div key={cardIndex} className="flex items-center">
                        <div className={`text-sm ${
                          feature.key.includes('fee') 
                            ? getFeeColorClass(getFeatureValue(card, feature.key))
                            : 'text-gray-900'
                        }`}>
                          {getFeatureValue(card, feature.key)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Special Perks Section */}
                <div className="grid grid-cols-4 gap-6 py-4 px-4 rounded-lg bg-blue-50 border border-blue-200 mt-6">
                  <div className="flex items-center space-x-2 font-semibold text-gray-700">
                    <span className="text-lg">✨</span>
                    <span>Key Benefits</span>
                  </div>
                  {compareList.map((card, cardIndex) => (
                    <div key={cardIndex}>
                      <div className="space-y-2">
                        {card.special_perks.slice(0, 4).map((perk, perkIndex) => (
                          <div key={perkIndex} className="flex items-start text-xs text-gray-700">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <span className="line-clamp-2">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Best Suited For Section */}
                <div className="grid grid-cols-4 gap-6 py-4 px-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center space-x-2 font-semibold text-gray-700">
                    <span className="text-lg">🎯</span>
                    <span>Best For</span>
                  </div>
                  {compareList.map((card, cardIndex) => (
                    <div key={cardIndex}>
                      <div className="flex flex-wrap gap-1">
                        {card.best_suited_for.slice(0, 3).map((category, catIndex) => (
                          <span
                            key={catIndex}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="font-semibold text-gray-600">
                  Take Action
                </div>
                {compareList.map((card, cardIndex) => (
                  <div key={cardIndex} className="space-y-3">
                    <button
                      onClick={() => window.open(card.apply_link, '_blank')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => removeFromCompare(card.name)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Remove from Compare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                💡 <strong>Pro Tip:</strong> Consider your spending patterns and lifestyle when choosing a card
              </div>
              <button
                onClick={clearCompareList}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Clear All Comparisons
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Compare Bar
  const CompareBar = () => {
    if (compareList.length === 0) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-40 transform transition-transform duration-300">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="font-bold text-gray-900 text-lg">
                  Compare Cards ({compareList.length}/3)
                </span>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {compareList.map((card, index) => (
                  <div key={index} className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full pl-4 pr-2 py-2 text-sm whitespace-nowrap">
                    <span className="font-medium text-gray-800 max-w-32 truncate">{card.name}</span>
                    <button
                      onClick={() => removeFromCompare(card.name)}
                      className="ml-2 w-5 h-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Compare Now</span>
                </span>
              </button>
              <button
                onClick={clearCompareList}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayedCards = showAll ? filteredCards : filteredCards.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Premium Cards...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Premium Credit Cards - Find Your Perfect Match</title>
        <meta name="description" content="Compare and discover the best credit cards in India with exclusive rewards, cashback, and premium benefits." />
        <meta name="keywords" content="credit cards, cashback, rewards, travel cards, premium cards" />
      </Head>

      <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-300 via-cyan-200 to-indigo-300">
        {/* Enhanced Compare Bar */}
        <CompareBar />

        {/* Header */}
        <div className=" shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Premium Credit Cards</h1>
                <p className="mt-2 text-gray-600">Compare and choose the perfect credit card for your lifestyle</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-800 font-semibold">{filteredCards.length} Cards Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Sort */}
          <div className="mb-8 bg-white rounded-2xl text-black shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="annual_fee">Annual Fee</option>
                  <option value="reward_rate">Reward Rate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedCards.map((card, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border group ${
                  isInCompareList(card.name) ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' : 'border-gray-200'
                }`}
              >
                {/* Card Image */}
                <div className="relative h-48 bg-black overflow-hidden">
                  {cardImages[card.name] ? (
                    <Image
                      src={cardImages[card.name]}
                      alt={card.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="w-16 h-10 bg-white/20 rounded-md mx-auto mb-3 flex items-center justify-center">
                          <span className="text-xs font-bold">CARD</span>
                        </div>
                        <h3 className="font-bold text-lg px-4 text-center">{card.name}</h3>
                      </div>
                    </div>
                  )}
                  
                  {/* Card Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                      {card.reward_type}
                    </span>
                  </div>

                  {/* Enhanced Compare Checkbox */}
                  <div className="absolute top-4 left-4">
                    <button
                      onClick={() => isInCompareList(card.name) ? removeFromCompare(card.name) : addToCompare(card)}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        isInCompareList(card.name)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                          : 'bg-white/90 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                      }`}
                    >
                      {isInCompareList(card.name) ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Card Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{card.name}</h3>
                    <p className="text-gray-600 text-sm">{card.issuer}</p>
                  </div>

                  {/* Reward Highlight */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Reward Rate</p>
                        <p className="text-lg font-bold text-green-700">{card.reward_rate.split(',')[0]}</p>
                      </div>
                      <div className="text-green-600">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Fees */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Joining Fee</span>
                      <span className="text-sm font-semibold text-gray-900">{card.joining_fee}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Annual Fee</span>
                      <span className="text-sm font-semibold text-gray-900">{card.annual_fee}</span>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Benefits</h4>
                    <div className="space-y-1">
                      {card.special_perks.slice(0, 3).map((perk, perkIndex) => (
                        <div key={perkIndex} className="flex items-start text-sm">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-gray-700 line-clamp-2">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Suited For Tags */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {card.best_suited_for.slice(0, 3).map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex text-black space-x-3">
                    <button
                      onClick={() => window.open(card.apply_link, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                      Apply Now
                    </button>
                    <button 
                      onClick={() => isInCompareList(card.name) ? removeFromCompare(card.name) : addToCompare(card)}
                      className={`px-4 py-3 border font-semibold rounded-lg transition-all duration-200 text-sm ${
                        isInCompareList(card.name)
                          ? 'border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isInCompareList(card.name) ? (
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span>Added</span>
                        </span>
                      ) : (
                        'Compare'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {!showAll && filteredCards.length > 6 && (
            <div className="text-center mb-12">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center px-8 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                Show {filteredCards.length - 6} More Cards
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{cards.length}+</div>
                <div className="text-gray-600">Premium Cards</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">5%</div>
                <div className="text-gray-600">Max Cashback</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                <div className="text-gray-600">Secure Applications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compare Modal */}
        <CompareModal />
      </div>
    </>
  );
}