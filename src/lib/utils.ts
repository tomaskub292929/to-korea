import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format rating to display (e.g., 4.8)
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Format student count (e.g., 1,234)
export function formatStudentCount(count: number): string {
  return count.toLocaleString();
}

// Get job opportunity badge color
export function getJobOpportunityColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'bg-leica-orange text-white';
    case 'medium':
      return 'bg-leica-gold text-deep-navy';
    case 'low':
      return 'bg-warm-gray text-white';
    default:
      return 'bg-warm-gray text-white';
  }
}

// Get job opportunity label
export function getJobOpportunityLabel(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'High Opportunity';
    case 'medium':
      return 'Medium Opportunity';
    case 'low':
      return 'Low Opportunity';
    default:
      return 'Unknown';
  }
}

// Get region label
export function getRegionLabel(region: string): string {
  const labels: Record<string, string> = {
    'northern-europe': 'Northern Europe',
    'western-europe': 'Western Europe',
    'eastern-europe': 'Eastern Europe',
    'russia': 'Russia',
    'central-asia': 'Central Asia',
  };
  return labels[region] || region;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
