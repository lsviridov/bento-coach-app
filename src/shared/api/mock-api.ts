// Mock API functions to simulate backend calls
export interface DailySummaryData {
  water: number;
  protein: number;
  protocol: number;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

// Mock daily summary data
export const fetchDailySummary = async (): Promise<DailySummaryData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    water: 0.65,
    protein: 0.40,
    protocol: 0.80
  };
};

// Mock featured product data
export const fetchFeaturedProduct = async (): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: '1',
    title: 'Нуклеамин',
    price: '49.00 BYN',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23CBF3F0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%232EC4B6" font-size="24"%3E💊%3C/text%3E%3C/svg%3E'
  };
};