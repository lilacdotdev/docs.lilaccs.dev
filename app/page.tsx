"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PostCard } from "@/components/post-card"
import { PostDetail } from "@/components/post-detail"
import { ThemeToggle } from "@/components/theme-toggle"

// Enhanced mock data for posts with full content
const mockPosts = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    subtitle: "Learn how to architect React applications that can grow with your team and user base.",
    date: "December 15, 2024",
    tags: ["Web Dev", "React", "Architecture"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Building scalable React applications is one of the most important skills for modern web developers. As applications grow in complexity and team size, the architecture decisions you make early on can significantly impact your project's long-term success.</p>
      
      <h2>Key Principles of Scalable Architecture</h2>
      <p>When designing a scalable React application, there are several fundamental principles to keep in mind:</p>
      
      <ul>
        <li><strong>Component Composition:</strong> Break down complex UIs into smaller, reusable components</li>
        <li><strong>State Management:</strong> Choose the right state management solution for your application's needs</li>
        <li><strong>Code Organization:</strong> Structure your codebase in a way that makes it easy to navigate and maintain</li>
        <li><strong>Performance Optimization:</strong> Implement lazy loading, memoization, and other performance techniques</li>
      </ul>
      
      <h2>Folder Structure Best Practices</h2>
      <p>A well-organized folder structure is crucial for scalability. Here's a recommended approach:</p>
      
      <pre><code>src/
  components/
    ui/
    forms/
    layout/
  hooks/
  utils/
  types/
  services/
  pages/</code></pre>
      
      <p>This structure separates concerns and makes it easy for team members to find and modify code. Each folder has a specific purpose, making the codebase more maintainable as it grows.</p>
      
      <h2>Conclusion</h2>
      <p>Building scalable React applications requires careful planning and adherence to best practices. By following these guidelines, you'll be well on your way to creating applications that can grow with your needs.</p>
    `,
  },
  {
    id: "2",
    title: "Introduction to Machine Learning",
    subtitle: "A comprehensive guide to getting started with machine learning concepts and implementations.",
    date: "December 10, 2024",
    tags: ["AI", "Machine Learning", "Python"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Machine Learning has revolutionized the way we approach problem-solving in technology. From recommendation systems to autonomous vehicles, ML algorithms are powering the next generation of intelligent applications.</p>
      
      <h2>What is Machine Learning?</h2>
      <p>Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.</p>
      
      <h2>Types of Machine Learning</h2>
      <p>There are three main types of machine learning:</p>
      
      <ol>
        <li><strong>Supervised Learning:</strong> Learning with labeled data</li>
        <li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data</li>
        <li><strong>Reinforcement Learning:</strong> Learning through interaction and feedback</li>
      </ol>
      
      <h2>Getting Started</h2>
      <p>To begin your machine learning journey, you'll need to understand:</p>
      
      <ul>
        <li>Basic statistics and probability</li>
        <li>Programming (Python is recommended)</li>
        <li>Linear algebra fundamentals</li>
        <li>Data preprocessing techniques</li>
      </ul>
      
      <p>The field of machine learning is vast and exciting, offering endless opportunities for innovation and discovery.</p>
    `,
  },
  {
    id: "3",
    title: "My Latest Hardware Project",
    subtitle: "Building a custom IoT device from scratch using Arduino and various sensors.",
    date: "December 5, 2024",
    tags: ["Hardware", "IoT", "Arduino"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Recently, I embarked on an exciting hardware project to build a custom IoT environmental monitoring device. This project combines my passion for electronics with practical applications for smart home automation.</p>
      
      <h2>Project Overview</h2>
      <p>The goal was to create a device that could monitor temperature, humidity, air quality, and light levels, then transmit this data to a web dashboard for real-time monitoring.</p>
      
      <h2>Components Used</h2>
      <ul>
        <li>Arduino ESP32 microcontroller</li>
        <li>DHT22 temperature and humidity sensor</li>
        <li>MQ-135 air quality sensor</li>
        <li>BH1750 light sensor</li>
        <li>OLED display for local readings</li>
        <li>Custom PCB for clean connections</li>
      </ul>
      
      <h2>Challenges and Solutions</h2>
      <p>One of the biggest challenges was managing power consumption to ensure the device could run on battery power for extended periods. I implemented deep sleep modes and optimized the sensor reading intervals.</p>
      
      <h2>Results</h2>
      <p>The final device successfully monitors environmental conditions and uploads data to a cloud dashboard every 5 minutes. Battery life exceeds 2 months on a single charge.</p>
      
      <p>This project taught me valuable lessons about hardware design, power management, and IoT protocols. The next iteration will include additional sensors and improved weatherproofing for outdoor deployment.</p>
    `,
  },
  {
    id: "4",
    title: "Reflections on 2024",
    subtitle: "Looking back at the year and sharing thoughts on personal growth and development.",
    date: "December 1, 2024",
    tags: ["Personal", "Reflection"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>As 2024 comes to a close, I find myself reflecting on the incredible journey this year has been. It's been a year of significant growth, both professionally and personally.</p>
      
      <h2>Professional Achievements</h2>
      <p>This year marked several important milestones in my career:</p>
      
      <ul>
        <li>Launched three major projects that are now being used by thousands of users</li>
        <li>Spoke at two technology conferences about modern web development</li>
        <li>Mentored five junior developers, helping them advance in their careers</li>
        <li>Contributed to several open-source projects</li>
      </ul>
      
      <h2>Personal Growth</h2>
      <p>Beyond professional achievements, 2024 has been a year of personal discovery. I've learned the importance of work-life balance and have made conscious efforts to pursue hobbies outside of technology.</p>
      
      <h2>Lessons Learned</h2>
      <p>Some key insights from this year:</p>
      
      <ol>
        <li>Consistency beats intensity in skill development</li>
        <li>Building relationships is as important as building software</li>
        <li>Taking breaks actually improves productivity</li>
        <li>Teaching others is one of the best ways to learn</li>
      </ol>
      
      <h2>Looking Forward</h2>
      <p>As I look toward 2025, I'm excited about new challenges and opportunities. The technology landscape continues to evolve rapidly, and I'm eager to be part of that evolution.</p>
      
      <p>Thank you to everyone who has been part of this journey. Here's to continued growth and learning in the year ahead!</p>
    `,
  },
  {
    id: "5",
    title: "Advanced AI Techniques",
    subtitle: "Exploring cutting-edge AI methodologies and their practical applications.",
    date: "November 28, 2024",
    tags: ["AI", "Research", "Deep Learning"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>The field of artificial intelligence continues to advance at a breathtaking pace. In this post, I'll explore some of the most exciting recent developments in AI and their potential applications.</p>
      
      <h2>Transformer Architecture Evolution</h2>
      <p>The transformer architecture has revolutionized natural language processing and is now being applied to computer vision, audio processing, and even protein folding prediction.</p>
      
      <h2>Emerging Techniques</h2>
      <p>Several cutting-edge techniques are pushing the boundaries of what's possible:</p>
      
      <ul>
        <li><strong>Few-shot Learning:</strong> Training models to learn new tasks with minimal examples</li>
        <li><strong>Neural Architecture Search:</strong> Automatically designing optimal neural network architectures</li>
        <li><strong>Federated Learning:</strong> Training models across distributed devices while preserving privacy</li>
        <li><strong>Multimodal AI:</strong> Systems that can process and understand multiple types of data simultaneously</li>
      </ul>
      
      <h2>Practical Applications</h2>
      <p>These advanced techniques are already being applied in various domains:</p>
      
      <ol>
        <li>Healthcare: Drug discovery and medical image analysis</li>
        <li>Autonomous Systems: Self-driving cars and robotics</li>
        <li>Creative Industries: AI-generated art, music, and content</li>
        <li>Scientific Research: Climate modeling and materials science</li>
      </ol>
      
      <h2>Ethical Considerations</h2>
      <p>As AI becomes more powerful, it's crucial to consider the ethical implications of these technologies. We must ensure that AI development is guided by principles of fairness, transparency, and human benefit.</p>
      
      <p>The future of AI is incredibly promising, but it requires thoughtful development and responsible deployment to realize its full potential for humanity.</p>
    `,
  },
  {
    id: "6",
    title: "Software Architecture Patterns",
    subtitle: "Understanding common software design patterns and when to use them.",
    date: "November 25, 2024",
    tags: ["Software", "Architecture", "Design Patterns"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Software architecture patterns provide proven solutions to common design problems. Understanding these patterns is essential for building maintainable, scalable, and robust software systems.</p>
      
      <h2>Why Architecture Patterns Matter</h2>
      <p>Architecture patterns offer several benefits:</p>
      
      <ul>
        <li>Provide a common vocabulary for developers</li>
        <li>Offer proven solutions to recurring problems</li>
        <li>Improve code organization and maintainability</li>
        <li>Facilitate team collaboration and knowledge sharing</li>
      </ul>
      
      <h2>Common Architecture Patterns</h2>
      
      <h3>Model-View-Controller (MVC)</h3>
      <p>MVC separates application logic into three interconnected components, promoting separation of concerns and code reusability.</p>
      
      <h3>Microservices Architecture</h3>
      <p>This pattern structures an application as a collection of loosely coupled services, enabling independent deployment and scaling.</p>
      
      <h3>Event-Driven Architecture</h3>
      <p>Components communicate through events, promoting loose coupling and enabling real-time processing of data.</p>
      
      <h3>Layered Architecture</h3>
      <p>Organizes code into horizontal layers, each with specific responsibilities, making the system easier to understand and maintain.</p>
      
      <h2>Choosing the Right Pattern</h2>
      <p>The choice of architecture pattern depends on various factors:</p>
      
      <ol>
        <li>Project requirements and constraints</li>
        <li>Team size and expertise</li>
        <li>Performance and scalability needs</li>
        <li>Maintenance and evolution requirements</li>
      </ol>
      
      <h2>Best Practices</h2>
      <p>When implementing architecture patterns:</p>
      
      <ul>
        <li>Start simple and evolve as needed</li>
        <li>Document architectural decisions</li>
        <li>Consider the trade-offs of each pattern</li>
        <li>Regularly review and refactor the architecture</li>
      </ul>
      
      <p>Understanding and applying appropriate architecture patterns is a key skill for any software developer looking to build high-quality, maintainable systems.</p>
    `,
  },
]

export default function HomePage() {
  const [currentFilter, setCurrentFilter] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState(mockPosts)
  const [selectedPost, setSelectedPost] = useState<(typeof mockPosts)[0] | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/") {
      setCurrentFilter(null)
      setFilteredPosts(mockPosts)
    } else {
      const filter = pathname.slice(1).replace("-", " ")
      const normalizedFilter = filter.charAt(0).toUpperCase() + filter.slice(1)
      setCurrentFilter(normalizedFilter)

      const filtered = mockPosts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === normalizedFilter.toLowerCase()),
      )
      setFilteredPosts(filtered)
    }
  }, [pathname])

  const handleFilterChange = (filter: string | null) => {
    setCurrentFilter(filter)
    setSelectedPost(null) // Reset selected post when filter changes
    if (filter) {
      const filtered = mockPosts.filter((post) => post.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase()))
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(mockPosts)
    }
  }

  const handlePostClick = (post: (typeof mockPosts)[0]) => {
    setSelectedPost(post)
  }

  const handleBackToList = () => {
    setSelectedPost(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onFilterChange={handleFilterChange} />

      <main className="flex-1 p-8 transition-all duration-300 ease-in-out">
        {selectedPost ? (
          <PostDetail post={selectedPost} onBack={handleBackToList} />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Header with theme toggle */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{currentFilter ? `${currentFilter} Posts` : "All Posts"}</h1>
                <p className="text-foreground/60">
                  {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
                </p>
              </div>
              <ThemeToggle />
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground/60 text-lg">No posts found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
