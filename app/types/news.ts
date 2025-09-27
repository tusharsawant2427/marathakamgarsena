export interface NewsItem {
  id: number;
  name: string;
  doc_name: string;
  content: string;
  file_name: string;
  doc_url?: string;
  news_link?: string;
  language: string;
  is_active: number;
  addedby: number;
  created_at: string;
  updated_at: string;
} 