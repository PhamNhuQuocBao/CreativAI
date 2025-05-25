import { BlogResponseType } from '@/types/blog'

export const MOCK_BLOGS: BlogResponseType[] = [
  {
    _id: '1',
    title: 'The Future of Artificial Intelligence',
    slug: 'the-future-of-artificial-intelligence',
    content:
      'Artificial Intelligence is revolutionizing every industry, from healthcare to transportation...',
    authorId: {
      _id: 'author1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://github.com/shadcn.png',
      bio: 'John Doe is a software engineer at Google',
    },
    status: 'published',
    tags: ['AI', 'Technology', 'Future'],
    aiGenerated: {
      content:
        'AI-generated insights about the future of technology and its impact on society...',
      images: [
        'https://example.com/ai-future-1.jpg',
        'https://example.com/ai-future-2.jpg',
      ],
      modelUsed: 'GPT-4',
      prompt: 'Write about the future of AI and its impact on society',
      _id: 'ai1',
    },
    views: 1250,
    ratings: [
      {
        userId: 'user1',
        score: 5,
        comment: 'Excellent article with great insights!',
        createdAt: '2024-03-15T10:00:00Z',
      },
      {
        userId: 'user2',
        score: 4,
        comment: 'Very informative content',
        createdAt: '2024-03-15T11:30:00Z',
      },
    ],
    reactionCounts: {
      like: 45,
      love: 23,
      wow: 15,
      angry: 2,
      dislike: 1,
      _id: 'reaction1',
    },
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z',
  },
  {
    _id: '2',
    title: 'Web Development Best Practices 2024',
    slug: 'web-development-best-practices-2024',
    content:
      'Stay ahead of the curve with these essential web development practices for 2024...',
    authorId: {
      _id: 'author2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://github.com/shadcn.png',
      bio: 'Jane Smith is a web developer at Facebook',
    },
    status: 'published',
    tags: ['Web Development', 'Programming', 'Best Practices'],
    aiGenerated: {
      content:
        'AI-generated comprehensive guide to modern web development practices...',
      images: [
        'https://example.com/webdev-1.jpg',
        'https://example.com/webdev-2.jpg',
      ],
      modelUsed: 'GPT-4',
      prompt: 'Create a guide for web development best practices in 2024',
      _id: 'ai2',
    },
    views: 890,
    ratings: [
      {
        userId: 'user3',
        score: 5,
        comment: 'Great compilation of best practices!',
        createdAt: '2024-03-14T15:00:00Z',
      },
    ],
    reactionCounts: {
      like: 32,
      love: 18,
      wow: 12,
      angry: 0,
      dislike: 2,
      _id: 'reaction2',
    },
    createdAt: '2024-03-14T14:00:00Z',
    updatedAt: '2024-03-14T14:00:00Z',
  },
  {
    _id: '3',
    title: 'Getting Started with Next.js and TypeScript',
    slug: 'getting-started-with-nextjs-and-typescript',
    content:
      'Learn how to build modern web applications using Next.js and TypeScript...',
    authorId: {
      _id: 'author1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://github.com/shadcn.png',
      bio: 'John Doe is a software engineer at Google',
    },
    status: 'draft',
    tags: ['Next.js', 'TypeScript', 'React'],
    aiGenerated: {
      content:
        'AI-generated tutorial on setting up and using Next.js with TypeScript...',
      images: [
        'https://example.com/nextjs-1.jpg',
        'https://example.com/nextjs-2.jpg',
      ],
      modelUsed: 'GPT-4',
      prompt: 'Create a beginner-friendly guide for Next.js and TypeScript',
      _id: 'ai3',
    },
    views: 0,
    ratings: [],
    reactionCounts: {
      like: 0,
      love: 0,
      wow: 0,
      angry: 0,
      dislike: 0,
      _id: 'reaction3',
    },
    createdAt: '2024-03-16T08:00:00Z',
    updatedAt: '2024-03-16T08:00:00Z',
  },
  {
    _id: '4',
    title: 'Machine Learning for Beginners',
    slug: 'machine-learning-for-beginners',
    content:
      'A comprehensive introduction to machine learning concepts and applications...',
    authorId: {
      _id: 'author3',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: 'https://github.com/shadcn.png',
      bio: 'Jane Smith is a web developer at Facebook',
    },
    status: 'published',
    tags: ['Machine Learning', 'AI', 'Data Science'],
    aiGenerated: {
      content: 'AI-generated introduction to machine learning fundamentals...',
      images: ['https://example.com/ml-1.jpg', 'https://example.com/ml-2.jpg'],
      modelUsed: 'GPT-4',
      prompt: 'Write a beginner-friendly introduction to machine learning',
      _id: 'ai4',
    },
    views: 567,
    ratings: [
      {
        userId: 'user4',
        score: 5,
        comment: 'Perfect for beginners!',
        createdAt: '2024-03-13T16:00:00Z',
      },
      {
        userId: 'user5',
        score: 4,
        comment: 'Very clear explanations',
        createdAt: '2024-03-13T17:30:00Z',
      },
    ],
    reactionCounts: {
      like: 28,
      love: 15,
      wow: 8,
      angry: 1,
      dislike: 0,
      _id: 'reaction4',
    },
    createdAt: '2024-03-13T15:00:00Z',
    updatedAt: '2024-03-13T15:00:00Z',
  },
]
