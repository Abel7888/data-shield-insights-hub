
import { BlogPost, User, BlogCategory } from './types';

// Local storage keys
const POSTS_STORAGE_KEY = 'data-shield-blog-posts';
const USERS_STORAGE_KEY = 'data-shield-blog-users';
const AUTH_TOKEN_KEY = 'data-shield-auth-token';

// Helper to generate random IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper to generate slugs from titles
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Blog Post Storage
export const getBlogPosts = (): BlogPost[] => {
  const posts = localStorage.getItem(POSTS_STORAGE_KEY);
  return posts ? JSON.parse(posts) : seedBlogPosts();
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
};

export const getBlogPostById = (id: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(post => post.id === id);
};

export const getBlogPostsByCategory = (category: BlogCategory): BlogPost[] => {
  const posts = getBlogPosts();
  return posts.filter(post => post.category === category);
};

export const getRecentBlogPosts = (count: number = 5): BlogPost[] => {
  const posts = getBlogPosts();
  return posts
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, count);
};

export const getFeaturedBlogPosts = (): BlogPost[] => {
  const posts = getBlogPosts();
  return posts.filter(post => post.featured);
};

export const saveBlogPost = (post: BlogPost): BlogPost => {
  const posts = getBlogPosts();
  
  // If it's a new post (no ID), generate an ID and slug
  if (!post.id) {
    post.id = generateId();
    post.slug = generateSlug(post.title);
    post.publishedDate = new Date().toISOString();
    posts.push(post);
  } else {
    // Find and update existing post
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      // Update slug only if title changed
      if (posts[index].title !== post.title) {
        post.slug = generateSlug(post.title);
      }
      posts[index] = post;
    }
  }
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  return post;
};

export const deleteBlogPost = (id: string): boolean => {
  const posts = getBlogPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length < posts.length) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
    return true;
  }
  return false;
};

// User Storage
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : seedUsers();
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
};

export const saveUser = (user: User): User => {
  const users = getUsers();
  
  if (!user.id) {
    user.id = generateId();
    users.push(user);
  } else {
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    }
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return user;
};

// Authentication
export const setAuthToken = (userId: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, userId);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  const user = getUserById(token);
  return user || null;
};

// Seed initial data
function seedUsers(): User[] {
  const defaultUsers: User[] = [
    {
      id: generateId(),
      username: 'admin',
      password: 'admin123', // In a real app, this would be hashed
      isAdmin: true
    }
  ];
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function seedBlogPosts(): BlogPost[] {
  const defaultPosts: BlogPost[] = [
    {
      id: generateId(),
      title: 'Blockchain Revolution in Real Estate Transactions',
      slug: 'blockchain-revolution-real-estate',
      excerpt: 'How blockchain technology is transforming property transactions and title management in the real estate industry.',
      content: `
## The Blockchain Revolution in Real Estate

Blockchain technology is fundamentally changing how we handle real estate transactions, bringing unprecedented transparency and efficiency to an industry long plagued by paperwork and middlemen.

### Smart Contracts and Property Transactions

Smart contracts—self-executing contracts with the terms directly written into code—are eliminating the need for intermediaries in property transactions. When conditions are met, the contract automatically executes, transferring ownership and funds instantly.

This innovation slashes transaction times from weeks to minutes while significantly reducing closing costs. For buyers and sellers, this means:

- Faster closings without waiting periods
- Reduced fees previously paid to title companies and escrow services
- Increased transaction security through immutable blockchain records

### Tokenization of Real Estate Assets

Property tokenization is another groundbreaking application, dividing real estate assets into digital tokens representing ownership shares. This fractional ownership model:

- Makes real estate investment accessible to more people with lower capital requirements
- Increases market liquidity as shares can be traded easily
- Enables global investment without geographic limitations

### Title Management and Verification

Perhaps the most immediate benefit lies in title management. Blockchain provides:

- Immutable records of ownership history
- Instant verification capabilities
- Elimination of title insurance in many cases
- Reduction in title-related disputes and fraud

### Looking Ahead

As regulatory frameworks catch up with these innovations, we can expect blockchain adoption to accelerate across the real estate industry. Early adopters are already seeing significant competitive advantages through increased efficiency and reduced costs.

For property investors and real estate professionals, understanding blockchain is no longer optional—it's becoming essential knowledge in a rapidly evolving marketplace.
      `,
      coverImage: '/lovable-uploads/7b9bbf4b-112d-4850-b529-5580f484da0f.png',
      category: 'real-estate',
      publishedDate: new Date().toISOString(),
      author: 'Admin',
      featured: true
    },
    {
      id: generateId(),
      title: 'AI-Powered Risk Assessment Transforming Financial Services',
      slug: 'ai-powered-risk-assessment-finance',
      excerpt: 'How artificial intelligence is revolutionizing risk management and credit decisions in the financial sector.',
      content: `
## AI-Powered Risk Assessment in Financial Services

Artificial intelligence is fundamentally changing how financial institutions assess risk, make lending decisions, and detect fraud—creating more accurate, efficient, and inclusive financial systems.

### Machine Learning for Credit Decisions

Traditional credit scoring has always been limited by its reliance on historical data and simple statistical models. Today's AI-powered systems can:

- Analyze thousands of data points rather than just dozens
- Identify subtle patterns human analysts would miss
- Create personalized risk profiles for borrowers
- Detect signs of potential default much earlier

Financial institutions implementing these systems report up to 25% improvement in prediction accuracy while significantly reducing processing times from days to minutes.

### Alternative Data Sources

Perhaps most revolutionary is how AI enables the use of alternative data for evaluating creditworthiness:

- Payment histories for utilities and subscriptions
- Professional credentials and employment stability
- Digital footprint and behavioral patterns
- Even smartphone usage patterns for the unbanked

This broadened approach allows financial institutions to serve previously excluded populations who lack traditional credit histories—potentially bringing billions of people worldwide into the formal financial system.

### Real-Time Fraud Detection

In fraud prevention, AI systems now operate continuously in real-time, with the ability to:

- Flag suspicious transactions instantly
- Adapt to new fraud patterns without reprogramming
- Reduce false positives that frustrate legitimate customers
- Save institutions billions annually in fraud losses

### Looking Forward

As these technologies mature, we're seeing the emergence of fully autonomous financial risk systems that can make instant lending decisions 24/7 without human intervention. The competitive advantage for early adopters is substantial, with both cost reductions and increased market share.

The future of financial risk assessment clearly belongs to institutions that can effectively harness AI while maintaining regulatory compliance and customer trust.
      `,
      coverImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      category: 'finance',
      publishedDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      author: 'Admin'
    },
    {
      id: generateId(),
      title: 'IoT and Predictive Analytics Revolutionizing Healthcare Delivery',
      slug: 'iot-predictive-analytics-healthcare',
      excerpt: 'How Internet of Things devices combined with advanced analytics are transforming patient care and hospital management.',
      content: `
## IoT and Predictive Analytics in Healthcare

The integration of Internet of Things (IoT) technology with predictive analytics is creating unprecedented opportunities for improved patient outcomes, preventative care, and operational efficiency in healthcare facilities.

### Remote Patient Monitoring

Wearable IoT devices have transformed patient monitoring capabilities:

- Continuous vital sign tracking without hospitalization
- Early warning systems for deteriorating conditions
- Improved management of chronic diseases
- Reduced hospital readmissions by up to 40%

These devices generate massive data streams that, when analyzed with AI, provide insights impossible to obtain through traditional periodic checkups.

### Predictive Analytics for Patient Outcomes

Healthcare providers using predictive analytics report remarkable improvements in patient care:

- 30-50% reduction in adverse events through early intervention
- More personalized treatment plans based on individual response patterns
- Better resource allocation for high-risk patients
- Significant reductions in treatment complications

### Hospital Resource Optimization

On the operational side, IoT sensors throughout medical facilities enable:

- Real-time tracking of equipment location and utilization
- Predictive maintenance of critical medical devices
- Optimization of patient flow through departments
- Staff allocation based on predicted demand patterns

Hospitals implementing these systems have reported average operational efficiency improvements of 15-25%, translating to millions in annual savings for larger facilities.

### Privacy and Security Considerations

While the benefits are compelling, healthcare organizations must address significant challenges:

- Ensuring HIPAA compliance with distributed IoT systems
- Protecting sensitive patient data from breaches
- Maintaining device security across thousands of endpoints
- Establishing clear protocols for AI-generated alerts

### The Future of Connected Healthcare

As these technologies mature, we're seeing the emergence of truly connected healthcare ecosystems where patients, providers, and systems exchange information seamlessly. Early adopters are gaining significant advantages in both clinical outcomes and operational efficiency.

For healthcare administrators and clinicians alike, understanding these technologies is becoming essential to delivering competitive, high-quality care in the modern healthcare environment.
      `,
      coverImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      category: 'healthcare',
      publishedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      author: 'Admin',
      featured: true
    },
    {
      id: generateId(),
      title: 'Blockchain and AI Transforming Global Supply Chain Visibility',
      slug: 'blockchain-ai-supply-chain-visibility',
      excerpt: 'How emerging technologies are solving traditional supply chain challenges by providing end-to-end transparency and predictive capabilities.',
      content: `
## Blockchain and AI Transforming Supply Chains

The combination of blockchain technology and artificial intelligence is revolutionizing supply chain management, addressing long-standing challenges in transparency, efficiency, and resilience.

### End-to-End Traceability

Blockchain technology enables unprecedented visibility across complex global supply chains:

- Immutable records of each product's journey from raw material to consumer
- Real-time tracking of inventory location and condition
- Verification of sustainability and ethical sourcing claims
- Instant authentication to combat counterfeit products

Organizations implementing blockchain traceability report an average 20% reduction in time spent resolving supply chain disputes and discrepancies.

### Smart Contracts for Automated Logistics

Smart contracts—self-executing agreements with terms written in code—are streamlining logistics processes by:

- Automatically triggering payments when delivery conditions are met
- Executing penalties for missed deadlines without manual intervention
- Adjusting shipment routing based on real-time conditions
- Creating transparent multi-party agreements accessible to all stakeholders

These automated systems are eliminating paperwork delays that historically cost the logistics industry billions annually.

### AI-Powered Demand Forecasting

Artificial intelligence has transformed demand planning through:

- Analysis of thousands of variables affecting product demand
- Detection of subtle market patterns invisible to traditional methods
- Dynamic adjustment of forecasts based on real-time data
- Reduction of forecast errors by 30-50% in most implementations

The financial impact is substantial, with companies reporting inventory reductions of 20-30% while simultaneously improving product availability.

### Predictive Maintenance and Risk Management

AI systems are revolutionizing equipment reliability in logistics:

- Predicting failures before they occur through sensor data analysis
- Optimizing maintenance schedules to minimize disruption
- Identifying potential bottlenecks and suggesting alternatives
- Creating resilience through proactive risk management

### The Road Ahead

As these technologies mature and become more accessible, we're seeing the emergence of self-optimizing supply networks that continuously adapt to changing conditions without human intervention. The competitive advantage for early adopters is substantial, both in cost reduction and improved service levels.

For supply chain professionals, developing competency in these technologies is rapidly becoming a career necessity rather than an optional skill set.
      `,
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      category: 'supply-chain',
      publishedDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      author: 'Admin'
    },
    {
      id: generateId(),
      title: 'Digital Twins Revolutionizing Commercial Real Estate Management',
      slug: 'digital-twins-commercial-real-estate',
      excerpt: 'How virtual replicas of physical buildings are transforming property management, maintenance, and tenant experience.',
      content: `
## Digital Twins in Commercial Real Estate

Digital twin technology—creating virtual replicas of physical buildings that update in real-time—is transforming commercial property management from reactive to predictive, delivering unprecedented efficiency and tenant satisfaction.

### Predictive Building Maintenance

Traditional building maintenance relies heavily on scheduled inspections and tenant complaints. Digital twin technology enables:

- Continuous monitoring of building systems and components
- Predictive maintenance based on actual usage patterns
- Early detection of potential failures before they affect occupants
- Optimization of equipment lifecycles and replacement timing

Property managers implementing this technology report maintenance cost reductions of 15-25% while simultaneously improving building reliability.

### Space Utilization Optimization

Understanding how tenants use space has always been challenging. Digital twins provide:

- Heat maps of actual space utilization throughout the day
- Modeling of different layout configurations before physical changes
- Occupancy patterns to optimize HVAC and lighting systems
- Data-driven insights for future property development

These capabilities are particularly valuable as organizations adapt to hybrid work models, helping property owners maximize revenue per square foot.

### Enhanced Tenant Experience

Digital twins are revolutionizing tenant interaction with buildings through:

- Mobile apps that provide wayfinding and personalized building information
- Automated adjustment of environmental conditions based on preferences
- Simplified service requests tied directly to specific building components
- Augmented reality overlays for maintenance staff and occupants

Properties offering these enhanced experiences report higher tenant satisfaction, longer lease terms, and premium rental rates compared to conventional buildings.

### Sustainability Improvements

Environmental performance has become critical in commercial real estate. Digital twins enable:

- Real-time energy optimization across building systems
- Scenario planning for sustainability improvements
- Verification of actual vs. designed performance
- Documentation for green building certifications

Buildings using digital twin technology for energy management typically achieve 10-30% energy savings compared to traditional approaches.

### The Future of Intelligent Buildings

As digital twin technology becomes more accessible, we're seeing the emergence of fully intelligent buildings that continuously self-optimize for efficiency, comfort, and sustainability. For property owners and managers, understanding these technologies is rapidly becoming essential to maintaining competitive properties in premium markets.
      `,
      coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      category: 'real-estate',
      publishedDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      author: 'Admin'
    }
  ];
  
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(defaultPosts));
  return defaultPosts;
}
