export interface AddBlogPost {
  title: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  urlHandle: string;
  author: string;
  datePublished: Date;
  dateUpdated: Date;
  isVisible: boolean;
  categories: string[];
}