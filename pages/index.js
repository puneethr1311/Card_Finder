import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
    <Head>
        <title>Card Finder - Find Your Perfect Card</title>
        <meta name="description" content="Get personalized credit card recommendations powered by AI. Analyze your spending patterns and find the perfect card for your lifestyle." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-300 via-cyan-200 to-indigo-300 px-6 py-16 flex flex-col items-center text-center">
      
     
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Find Your Perfect
            <span className="text-blue-600 block">Credit Card</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personalized credit card recommendations based on your spending habits, 
            credit score, and financial goals. Smart AI-powered matching for the best rewards.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/chat" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🤖 Start AI Recommendation
          </Link>
          <Link 
            href="/cards" 
            className="bg-white/30 backdrop-blur-sm hover:bg-white/40 text-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 border border-white/50 shadow-lg"
          >
            📋 Browse All Cards
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl mb-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose Our Platform?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Matching</h3>
            <p className="text-gray-700 leading-relaxed">
              Our AI analyzes your spending patterns and preferences to recommend cards that maximize your rewards and benefits.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Interactive Chat</h3>
            <p className="text-gray-700 leading-relaxed">
              Have a conversation with our AI assistant to discuss your needs and get personalized recommendations in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Comprehensive Database</h3>
            <p className="text-gray-700 leading-relaxed">
              Access detailed information on 20+ credit cards with up-to-date rates, rewards, and terms to make informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full max-w-4xl mb-20">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 border border-white/30 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-700 font-medium">Credit Cards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">AI</div>
              <div className="text-gray-700 font-medium">Powered Matching</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-700 font-medium">Free Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="w-full max-w-5xl mb-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat with AI</h3>
            <p className="text-gray-600">Tell us about your spending habits and financial goals</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Matched</h3>
            <p className="text-gray-600">Our AI analyzes and finds the best cards for you</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose & Apply</h3>
            <p className="text-gray-600">Review recommendations and apply for your ideal card</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center max-w-4xl w-full shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Card?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands who have found their ideal credit card with our AI-powered recommendation system.
        </p>
        <Link 
          href="/chat" 
          className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started Now →
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-gray-600 text-center">
        <p>&copy; 2025 Credit Card Recommendation System. All rights reserved.</p>
      </footer>
    </div>
  </>
  );
  
}