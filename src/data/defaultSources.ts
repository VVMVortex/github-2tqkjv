import { NewsSource } from '../types';

export const defaultSources: NewsSource[] = [
  {
    id: 'ai-news',
    name: 'AI News',
    url: 'https://artificialintelligence-news.com/',
    type: 'website',
    category: 'Industry',
    active: true,
    selectors: {
      title: 'h2.entry-title',
      description: '.entry-content p:first-of-type',
      date: '.posted-on time',
      image: '.post-thumbnail img'
    }
  },
  {
    id: 'deepmind',
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/',
    type: 'website',
    category: 'Research',
    active: true,
    selectors: {
      title: 'h2.blog-card__title',
      description: '.blog-card__description',
      date: '.blog-card__date',
      image: '.blog-card__image img'
    }
  },
  {
    id: 'openai',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog',
    type: 'website',
    category: 'Research',
    active: true,
    selectors: {
      title: 'h2',
      description: '.prose p:first-of-type',
      date: 'time',
      image: 'img'
    }
  }
];