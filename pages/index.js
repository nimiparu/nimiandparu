import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="w-full">
      {/* Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Playfair Display' }}>
            ART HAMPER
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/gallery" className="navbar-link">Explore Gallery</Link>
            <Link href="/hamper-order" className="navbar-link">Create Order</Link>
            <Link href="/artist-signup" className="navbar-link">Join as Artist</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-6xl md:text-7xl font-bold mb-6" 
            style={{ fontFamily: 'Playfair Display', animation: 'fadeInUp 0.8s ease-out' }}
          >
            Artistic Hampers,
            <span className="gradient-text"> Curated by Creatives</span>
          </h1>

          <p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}
          >
            Connect with talented artists to create stunning, personalized gift hampers for every occasion.
          </p>

          <div className="divider mb-8" style={{ animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}></div>

          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.6s backwards' }}
          >
            <Link 
              href="/hamper-order" 
              className="hero-btn text-center"
            >
              ✨ Create Hamper
            </Link>
            <Link 
              href="/gallery"
              className="px-10 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-bold text-lg hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Explore Gallery
            </Link>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.8s backwards' }}
          >
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text mb-2">50+</div>
              <p className="text-sm text-gray-600">Artists</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text mb-2">200+</div>
              <p className="text-sm text-gray-600">Hampers Created</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text mb-2">1000+</div>
              <p className="text-sm text-gray-600">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment & Communication Features */}
      <section className="section py-20 px-6 bg-gradient-to-b from-transparent to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Your Peace of Mind</h2>
          <p className="section-subtitle">Easy payment with cash on delivery</p>

          <div className="max-w-2xl mx-auto">
            {/* Cash on Delivery Card */}
            <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3">Cash on Delivery</h3>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> No advance payment required
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Pay when hamper arrives
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Safe & convenient
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> Flexible payment options
                </li>
              </ul>
              <p className="text-sm text-gray-600">Complete peace of mind. You pay only when your beautiful hamper is delivered to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Browse Gallery', link: '/gallery', icon: '🎨' },
              { title: 'Sign Up as Artist', link: '/artist-signup', icon: '👨‍🎨' },
              { title: 'View Artists', link: '/artists', icon: '⭐' }
            ].map((item, i) => (
              <Link 
                key={i}
                href={item.link}
                className="card text-center hover:shadow-2xl group bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gradient-to-b from-purple-50/30 to-transparent py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Why Choose ART HAMPER</h2>
          <p className="section-subtitle">Experience the perfect blend of art, creativity, and personalization</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Handcrafted by Artists', desc: 'Each hamper is uniquely created by talented artists' },
              { icon: '🎯', title: 'Personalized Experience', desc: 'Customize every detail for your special occasion' },
              { icon: '⚡', title: 'Fast & Reliable', desc: 'Quality service with timely delivery guaranteed' }
            ].map((feature, i) => (
              <div key={i} className="card text-center hover:shadow-2xl" style={{ animation: `fadeInUp 0.6s ease-out ${0.2 * i}s backwards` }}>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Collaboration Section - Chat Feature */}
      <section className="section py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Collaborate in Real-Time</h2>
          <p className="section-subtitle">Communicate directly with artists throughout your project</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Chat Feature Card */}
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-3">Private Order Chat</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Send messages, share ideas, and collaborate directly with your artist team. See who's online, get typing indicators, and track message read status in real-time.
              </p>
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Real-time messaging
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Typing indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Online status
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Message read receipts
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">1</div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Create Your Order</h4>
                    <p className="text-gray-600">Start by creating a hamper order with your specifications</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">2</div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Get Connected</h4>
                    <p className="text-gray-600">Artists join your private chat room to collaborate</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">3</div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Real-Time Chat</h4>
                    <p className="text-gray-600">Discuss details, share ideas, and see live updates instantly</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white font-bold">4</div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Perfect Result</h4>
                    <p className="text-gray-600">Receive your custom art hamper exactly as envisioned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-12 text-center border border-purple-200">
          <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-lg text-gray-700 mb-8">Start creating your custom art hamper with our talented artists today</p>
          <Link href="/hamper-order" className="hero-btn text-center inline-block">
            Create Your First Hamper
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-md border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div>
              <h4 className="text-2xl font-bold gradient-text mb-4" style={{ fontFamily: 'Playfair Display' }}>ART HAMPER</h4>
              <p className="text-gray-600">Curating beautiful, handcrafted art hampers with talented artists worldwide.</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/gallery" className="navbar-link">Gallery</Link></li>
                <li><Link href="/hamper-order" className="navbar-link">Create Order</Link></li>
                <li><Link href="/artist-signup" className="navbar-link">Join Artists</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Connect</h5>
              <div className="flex gap-4">
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📘</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">📷</a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">🐦</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>&copy; 2026 ART HAMPER. All rights reserved. Crafted with ❤️ by artists, for everyone.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
