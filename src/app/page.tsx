import { getPosts } from '@/lib/posts';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full animate-pulse" style={{
            animationDuration: '8s'
          }} />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-400 rounded-full animate-pulse" style={{
            animationDuration: '6s'
          }} />
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 rounded-full animate-pulse" style={{
            animationDuration: '10s'
          }} />
        </div>
        
        {/* Animated financial elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-1/4 h-1 bg-green-400 animate-candlestickMove" style={{
            animationDuration: '15s',
            animationDelay: '0.5s'
          }} />
          <div className="absolute top-1/3 left-0 w-1/4 h-1 bg-red-400 animate-candlestickMove" style={{
            animationDuration: '12s',
            animationDelay: '1s'
          }} />
          <div className="absolute top-2/3 left-0 w-1/4 h-1 bg-blue-400 animate-candlestickMove" style={{
            animationDuration: '18s',
            animationDelay: '1.5s'
          }} />
          
          {/* Technical indicator dots */}
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-indicatorPulse" style={{
            animationDuration: '3s',
            animationDelay: '0.7s'
          }} />
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-indicatorPulse" style={{
            animationDuration: '4s',
            animationDelay: '1.2s'
          }} />
          <div className="absolute top-3/4 right-1/5 w-3 h-3 bg-pink-400 rounded-full animate-indicatorPulse" style={{
            animationDuration: '5s',
            animationDelay: '1.8s'
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            Analyst's Insight
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{
            animationDelay: '0.3s'
          }}>
            Premium fundamental analysis and market insights
          </p>
          <div className="flex gap-4 justify-center animate-fadeInUp" style={{
            animationDelay: '0.6s'
          }}>
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
               <div className="text-4xl mb-4">📊</div>
               <h3 className="text-xl font-semibold mb-2">In-Depth Analysis</h3>
               <p className="text-muted-foreground">
                 Comprehensive fundamental analysis with detailed financial metrics and valuation models.
               </p>
             </div>
             <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
               <div className="text-4xl mb-4">📈</div>
               <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
               <p className="text-muted-foreground">
                 Stay ahead with our timely market trend reports and sector deep dives.
               </p>
             </div>
             <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
               <div className="text-4xl mb-4">🔍</div>
               <h3 className="text-xl font-semibold mb-2">Exclusive Research</h3>
               <p className="text-muted-foreground">
                 Access proprietary research not available through mainstream channels.
               </p>
             </div>
           </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <blockquote className="text-lg italic mb-4">
                "The analysis provided by Analyst's Insight helped me make better investment decisions with confidence."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Portfolio Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <blockquote className="text-lg italic mb-4">
                "Finally, a research service that cuts through the noise and delivers actionable insights."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Hedge Fund Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Profile Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership</h2>
          <div className="max-w-4xl mx-auto bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                src="https://th.bing.com/th/id/OIP.ZJ_dxpQ9wLZkVTgfgTs0lQHaHa?w=167&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3" 
                alt="Gaphy Official" 
                className="w-full h-full object-cover"
              />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Gaphy Official</h3>
                <p className="text-lg text-muted-foreground mb-4">Founder & CEO</p>
                <p className="mb-6">
                  Visionary leader and founder of Analyst's Insight, bringing innovative approaches to market analysis.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/gaphy_official/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Instagram
                  </a>
                  <a href="https://twitter.com/GAPHY_OFFICIAL" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Twitter
                  </a>
                  <a href="https://www.tiktok.com/@gaphy_official" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Analysis</h2>
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
