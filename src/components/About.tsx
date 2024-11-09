import React from 'react';
import { Bot, Rss, Globe, Shield } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: 'AI-Focused News',
      description: 'Curated news and updates from the world of artificial intelligence, machine learning, and robotics.'
    },
    {
      icon: <Rss className="w-8 h-8 text-blue-600" />,
      title: 'Multiple Sources',
      description: 'Aggregated content from leading AI research institutions, companies, and technology blogs.'
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: 'Real-time Updates',
      description: 'Stay current with the latest developments in AI technology and research.'
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'Verified Sources',
      description: 'All news sources are verified and trusted within the AI community.'
    }
  ];

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About AI News Hub</h2>
      <p className="text-gray-600 mb-8">
        AI News Hub aggregates artificial intelligence news from trusted sources across the web.
        Stay informed about breakthroughs in AI research, industry developments, ethical considerations,
        and practical applications of artificial intelligence.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0">{feature.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}