import axios from 'axios';
import { NewsItem, NewsSource } from '../types';
import { parseWebsite } from './parsers';
import { NewsError } from './errors';

const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const FETCH_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function fetchWithRetry(url: string, retries = 0): Promise<string> {
  const proxyIndex = retries % PROXIES.length;
  const proxyUrl = `${PROXIES[proxyIndex]}${encodeURIComponent(url)}`;
  
  try {
    const response = await axios.get(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: FETCH_TIMEOUT
    });
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}

export async function fetchAllNews(sources: NewsSource[]): Promise<NewsItem[]> {
  if (!sources || sources.length === 0) return [];

  const activeSources = sources.filter(source => source.active);
  const newsPromises = activeSources.map(source => 
    fetchNewsFromSource(source).catch(error => {
      console.error(`Error fetching from ${source.name}:`, new NewsError(
        `Failed to fetch news from ${source.name}`,
        error instanceof Error ? error.message : 'Unknown error'
      ));
      return [];
    })
  );
  
  const results = await Promise.allSettled(newsPromises);
  return results
    .filter((result): result is PromiseFulfilledResult<NewsItem[]> => result.status === 'fulfilled')
    .map(result => result.value)
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function fetchNewsFromSource(source: NewsSource): Promise<NewsItem[]> {
  try {
    const data = await fetchWithRetry(source.url);
    const items = parseWebsite(data, source);
    
    return items.map(item => ({
      ...item,
      source: source.name,
      category: source.category,
      isGlobalImpact: detectGlobalImpact(item.title, item.description)
    }));
  } catch (error) {
    throw new NewsError(
      `Failed to fetch news from ${source.name}`,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

function detectGlobalImpact(title: string, description: string): boolean {
  const globalImpactKeywords = [
    'worldwide', 'global', 'international', 'breakthrough', 'revolutionary',
    'major advancement', 'groundbreaking', 'milestone', 'transformation',
    'industry-wide', 'market-changing', 'paradigm shift', 'disruption',
    'innovation', 'breakthrough', 'first-ever', 'unprecedented',
    'game-changing', 'leading', 'pioneer', 'revolution'
  ];

  const content = `${title} ${description}`.toLowerCase();
  return globalImpactKeywords.some(keyword => content.includes(keyword.toLowerCase()));
}