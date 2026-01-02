
import { Post, User, Story, Comment, MediaType } from '../types';

// --- Seed Data ---

const CURRENT_USER: User = {
  id: 'current-user',
  username: 'ai_engineer',
  fullName: 'Senior Dev',
  avatarUrl: 'https://picsum.photos/seed/me/150/150',
  isVerified: true,
};

const MOCK_USERS: User[] = [
  { id: 'u1', username: 'adventure_time', fullName: 'Finn Human', avatarUrl: 'https://picsum.photos/seed/u1/150/150' },
  { id: 'u2', username: 'design_daily', fullName: 'Creative Studio', avatarUrl: 'https://picsum.photos/seed/u2/150/150', isVerified: true },
  { id: 'u3', username: 'foodie_life', fullName: 'Chef Gordon', avatarUrl: 'https://picsum.photos/seed/u3/150/150' },
  { id: 'u4', username: 'travel_bug', fullName: 'Wanderlust', avatarUrl: 'https://picsum.photos/seed/u4/150/150' },
  { id: 'u5', username: 'tech_crunchy', fullName: 'Tech News', avatarUrl: 'https://picsum.photos/seed/u5/150/150' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    user: MOCK_USERS[0],
    mediaUrl: 'https://picsum.photos/seed/p1/600/600',
    mediaType: 'image',
    caption: 'Exploring the unknown! 🌲 #adventure #nature',
    likes: 124,
    likedByCurrentUser: false,
    comments: [
      { id: 'c1', userId: 'u2', username: 'design_daily', text: 'Amazing shot!', timestamp: Date.now() - 100000 },
    ],
    timestamp: Date.now() - 3600000,
    location: 'Ooo Land'
  },
  {
    id: 'p2',
    userId: 'u2',
    user: MOCK_USERS[1],
    mediaUrl: 'https://picsum.photos/seed/p2/600/800',
    mediaType: 'image',
    caption: 'Minimalist architecture is just soothing to the soul. 🏛️',
    likes: 892,
    likedByCurrentUser: true,
    comments: [],
    timestamp: Date.now() - 7200000,
    location: 'Berlin, Germany'
  },
  {
    id: 'p3',
    userId: 'u3',
    user: MOCK_USERS[2],
    mediaUrl: 'https://picsum.photos/seed/p3/600/600',
    mediaType: 'image',
    caption: 'Fresh pasta made from scratch. 🍝 Recipe in bio!',
    likes: 45,
    likedByCurrentUser: false,
    comments: [
        { id: 'c2', userId: 'u1', username: 'adventure_time', text: 'Yum!!', timestamp: Date.now() - 50000 },
    ],
    timestamp: Date.now() - 8000000,
  }
];

const INITIAL_STORIES: Story[] = MOCK_USERS.map((user, index) => ({
  id: `s${index}`,
  user,
  imageUrl: `https://picsum.photos/seed/story${index}/400/800`,
  isViewed: false,
}));

// --- Service Implementation ---

class MockDBService {
  private posts: Post[];
  private stories: Story[];
  public currentUser: User;

  constructor() {
    this.currentUser = CURRENT_USER;
    
    // Load from local storage or init
    const storedPosts = localStorage.getItem('instagen_posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    } else {
      this.posts = INITIAL_POSTS;
      this.savePosts();
    }

    this.stories = INITIAL_STORIES;
  }

  private savePosts() {
    localStorage.setItem('instagen_posts', JSON.stringify(this.posts));
  }

  async getFeed(): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.posts].sort((a, b) => b.timestamp - a.timestamp);
  }

  async getStories(): Promise<Story[]> {
    return this.stories;
  }

  async createPost(mediaUrl: string, caption: string, mediaType: MediaType = 'image', location?: string): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 800)); 
    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: this.currentUser.id,
      user: this.currentUser,
      mediaUrl,
      mediaType,
      caption,
      likes: 0,
      likedByCurrentUser: false,
      comments: [],
      timestamp: Date.now(),
      location
    };
    this.posts.unshift(newPost);
    this.savePosts();
    return newPost;
  }

  async toggleLike(postId: string): Promise<boolean> {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likedByCurrentUser = !post.likedByCurrentUser;
      post.likes += post.likedByCurrentUser ? 1 : -1;
      this.savePosts();
      return post.likedByCurrentUser;
    }
    return false;
  }

  async addComment(postId: string, text: string): Promise<Comment> {
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error("Post not found");
    
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: this.currentUser.id,
      username: this.currentUser.username,
      text,
      timestamp: Date.now()
    };
    
    post.comments.push(newComment);
    this.savePosts();
    return newComment;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return this.posts.filter(p => p.userId === userId);
  }
}

export const db = new MockDBService();
