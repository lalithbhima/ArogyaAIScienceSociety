import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart2, Bot, DollarSign, Users, Zap, Heart, Brain, Globe, MessageSquare, CheckCircle, XCircle, Search, Menu, X } from 'lucide-react';

// Mock data - replace with actual data from a CMS or API later
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "ArogyaAI",
    description: "An innovative, AI-powered health app to optimize accessible global wellness.",
    impact: "Improved early health awareness, preventive guidance, and AI-driven health education for students and families, with a focus on underserved and low-resource communities.",
    tags: ["Health Education", "Healthcare AI", "Global Wellness"],
    image: "https://placehold.co/600x400/2ecc71/ffffff?text=ArogyaAI+App",
    learnMoreLink: "/our-work/project-2"
  },
];

// Helper component for consistent section styling
const Section = ({ children, className = '', id }) => (
  <section id={id} className={`py-12 md:py-20 ${className}`}>
    <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
      {children}
    </div>
  </section>
);

// Navigation Component
const Header = ({ setCurrentPage, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'About Us', page: 'about' },
    { name: 'Our Work', page: 'work' },
    { name: 'Get Involved', page: 'involved' },
    { name: 'Ethical AI', page: 'ethics' },
    { name: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <img
              src="/logo.png"
              alt="ArogyaAI Logo"
              className="h-16 w-16 object-contain"
              />
            <h1 className="text-2xl font-extrabold text-[#15335d]">
              Arogya<span className="text-[#23c07e]">AI</span> Science Society
            </h1>
          </div>
          <nav className="hidden md:flex space-x-4 lg:space-x-6">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                  ${currentPage === link.page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                {link.name}
              </button>
            ))}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-blue-600 focus:outline-none">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-20 left-0 right-0 z-40 pb-4">
          <nav className="flex flex-col space-y-2 px-4">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`block px-3 py-3 rounded-md text-base font-medium text-left
                  ${currentPage === link.page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

// Footer Component
const Footer = ({ setCurrentPage }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  return (
    <footer className="bg-gray-800 text-gray-300">
      <Section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">ArogyaAI Science Society</h3>
            <p className="text-sm mb-4">Empowering underserved communities through ethical AI and scientific innovation for lasting health and well-being.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('contact')}
                aria-label="Contact Us"
                className="hover:text-blue-400 transition-colors"
              >
                <MessageSquare size={20} />
              </button>

              <button
                onClick={() => setCurrentPage('contact')}
                aria-label="Contact Us"
                className="hover:text-blue-400 transition-colors"
              >
                <Users size={20} />
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-blue-400">About Us</button></li>
              <li><button onClick={() => setCurrentPage('work')} className="hover:text-blue-400">Our Work</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-blue-400">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('ethics')} className="hover:text-blue-400">Ethical AI Framework</button></li>
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li> {/* Replace # with actual link */}
              <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li> {/* Replace # with actual link */}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm mb-3">Subscribe to our newsletter for the latest updates.</p>
              <form
                className="flex"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setNewsletterStatus('Submitting...');

                  try {
                    await fetch(
                      'https://script.google.com/macros/s/AKfycbxJfFvlmIxMoASDo_qeoqoJfQpOIwDemL5H5TnXTLyNRk7Qnv4gc2s9eYx296_jLMNRYQ/exec',
                      {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'newsletter',
                          email: newsletterEmail,
                          source: 'footer'
                        })
                      }
                    );

                    // If fetch does not throw, assume success
                    setNewsletterStatus('✅ Subscribed!');
                    setNewsletterEmail('');
                  } catch (err) {
                    setNewsletterStatus('❌ Error. Try later.');
                  }
                }}
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email"
                  aria-label="Your Email for Newsletter"
                  className="w-full px-3 py-2 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md font-semibold"
                >
                  Go
                </button>
              </form>

              {newsletterStatus && (
                <p className="text-xs mt-2 text-gray-400">{newsletterStatus}</p>
              )}
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ArogyaAI Science Society. All rights reserved.</p>
          <p className="mt-1">Designed with <Heart className="inline h-4 w-4 text-red-500" /> for a healthier future.</p>
          <p className="mt-2 text-gray-400 text-xs">
            Founded by Lalithendra Reddy Bhima &amp; Bhavika Bhima
          </p>
        </div>
      </Section>
    </footer>
  );
};

// HomePage Component
const HomePage = ({ setCurrentPage }) => {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center" id="home-hero">
        <div className="py-20 md:py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Advancing Health Equity with <span className="block sm:inline">Artificial Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            ArogyaAI Science Society leverages cutting-edge AI to bring transformative health solutions to underserved communities worldwide.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setCurrentPage('contact')}
              className="font-bold py-4 px-10 rounded-lg text-lg text-white
                        bg-gradient-to-r from-[#22aaff] to-[#23c07e]
                        shadow-xl hover:shadow-2xl
                        transition-all duration-300 transform hover:scale-105"
            >
              Support Our Mission
            </button>
            <button
              onClick={() => setCurrentPage('work')}
              className="bg-transparent hover:bg-white hover:text-blue-700 text-white font-bold py-4 px-10 rounded-lg text-lg border-2 border-white transition-all duration-300"
            >
              See Our Impact
            </button>
          </div>
        </div>
      </Section>

      {/* Our Mission Section */}
      <Section id="mission">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Mission: AI for Global Health</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are dedicated to developing and deploying ethical AI-driven solutions that address critical health challenges in communities with limited access to resources.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
            <p className="text-gray-600">Pioneering AI research and applications for tangible health outcomes.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Equity</h3>
            <p className="text-gray-600">Ensuring fair access to advanced health technologies for all.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Impact</h3>
            <p className="text-gray-600">Creating sustainable, positive change in community health and well-being.</p>
          </div>
        </div>
      </Section>

      {/* Featured Projects Section */}
      <Section id="featured-projects" className="bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured AI Initiatives</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how we're applying AI to solve real-world health problems.
          </p>
        </div>
        <div className="grid place-items-center">
          {MOCK_PROJECTS.slice(0,3).map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 w-full max-w-md"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-56 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found"; }}
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex-grow">{project.description.substring(0,100)}...</p>
                <div className="mb-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-1 mb-1 inline-block">{tag}</span>
                  ))}
                </div>
                <button onClick={() => setCurrentPage('work')} className="mt-auto text-blue-600 hover:text-blue-800 font-semibold flex items-center self-start">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <button onClick={() => setCurrentPage('work')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
                Explore All Projects
            </button>
        </div>
      </Section>

      {/* Impact Snapshot Section - Placeholder for advanced visualization */}
      <Section id="impact-snapshot">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Impact at a Glance</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualizing the difference we're making, powered by data and AI insights.
          </p>
        </div>
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold text-blue-600 mb-2">15,000+</h4>
              <p className="text-gray-700 font-medium">Lives Touched Directly</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-green-500 mb-2">30%</h4>
              <p className="text-gray-700 font-medium">Improvement in Diagnostic Speed (Avg.)</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-red-500 mb-2">5 Countries</h4>
              <p className="text-gray-700 font-medium">Active AI Health Programs</p>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Resource Allocation Efficiency (Mock Data)</h3>
            {/* Simple bar chart placeholder - Consider using a library like Recharts or D3 for actual charts */}
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-32 text-sm text-gray-600 shrink-0">AI Research:</span>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div className="bg-blue-500 h-6 rounded-full text-xs text-white flex items-center justify-center" style={{ width: '70%' }}>70%</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-sm text-gray-600 shrink-0">Field Deployment:</span>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div className="bg-green-500 h-6 rounded-full text-xs text-white flex items-center justify-center" style={{ width: '85%' }}>85%</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="w-32 text-sm text-gray-600 shrink-0">Community Training:</span>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div className="bg-yellow-500 h-6 rounded-full text-xs text-white flex items-center justify-center" style={{ width: '60%' }}>60%</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">This is a simplified representation. Detailed financial reports will be available.</p>
          </div>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section id="cta" className="bg-blue-700 text-white">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Your contribution can fuel life-changing AI innovations for those who need them most. Join us in shaping a healthier, more equitable future.
          </p>
          <button
            onClick={() => setCurrentPage('contact')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Contact Us to Get Involved
          </button>
        </div>
      </Section>
    </>
  );
};

// AboutUsPage Component
const AboutUsPage = ({ setCurrentPage }) => {
  return (
    <>
      <Section className="bg-gray-50 pt-24 md:pt-32 text-center" id="about-hero">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">About ArogyaAI Science Society</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Pioneering ethical AI solutions to create a healthier and more equitable world for underserved communities.
        </p>
      </Section>

      <Section id="our-story">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story & Vision</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              ArogyaAI Science Society was founded on the belief that advanced technology, particularly Artificial Intelligence, holds immense potential to bridge health disparities. We envision a world where everyone, regardless of their location or economic status, has access to high-quality healthcare insights and solutions.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our journey began with a small team of passionate scientists, doctors, and ethicists who saw the unmet needs in global health and the transformative power of AI. Today, we are a growing organization committed to rigorous research, community-centric deployment, and unwavering ethical standards.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We focus on creating AI tools that are not only innovative but also accessible, affordable, and adaptable to diverse local contexts. Our core values are innovation, integrity, collaboration, and impact.
            </p>
          </div>
          <div>
            <img 
              src="https://placehold.co/600x450/85C1E9/ffffff?text=Our+Vision+Concept" 
              alt="Conceptual image representing ArogyaAI's vision" 
              className="rounded-xl shadow-xl w-full h-auto"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x450/cccccc/ffffff?text=Image+Not+Found"; }}
            />
          </div>
        </div>
      </Section>

      <Section id="our-team" className="bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A focused, student-led team committed to ethical AI and global health equity.
          </p>
        </div>

        {/* TEAM MEMBER 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <img
            src="/Lalith.png"   // ← replace with your real image
            alt="Lalithendra Reddy Bhima"
            className="w-80 h-96 rounded-lg object-cover shadow-lg"
          />

          <div className="max-w-2xl text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-800">
              Lalithendra Reddy Bhima
            </h3>
            <p className="text-[#22aaff] font-medium mb-3">
              Co-Founder & Co-President & AI and Computer Science Research Lead 
            </p>
            <p className="text-gray-600 leading-relaxed">
              (add descripton)
            </p>
          </div>
        </div>

        {/* TEAM MEMBER 2 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src="/Bhavika.png"   // ← replace with your real image
            alt="Bhavika Bhima"
            className="w-80 h-96 rounded-lg object-cover shadow-lg"
          />

          <div className="max-w-2xl text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-800">
              Bhavika Bhima
            </h3>
            <p className="text-[#23c07e] font-medium mb-3">
              Co-Founder & Co-President & Biotechnology Lead
            </p>
            <p className="text-gray-600 leading-relaxed">
              (add desccription)
            </p>
          </div>
        </div>
      </Section>


      <Section id="our-approach">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Approach to AI in Global Health</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <Brain className="h-10 w-10 text-blue-600 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Ethical AI by Design</h3>
                <p className="text-gray-600">We embed ethical considerations, fairness, and transparency into every stage of our AI development lifecycle. <button onClick={() => setCurrentPage('ethics')} className="text-blue-600 hover:underline font-medium">Learn more about our framework.</button></p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <Users className="h-10 w-10 text-green-500 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Community Collaboration</h3>
                <p className="text-gray-600">We work closely with local communities and healthcare providers to ensure our solutions are culturally appropriate and meet real-world needs.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <BarChart2 className="h-10 w-10 text-yellow-500 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Data-Driven Impact</h3>
                <p className="text-gray-600">We rigorously measure and evaluate the impact of our interventions, using data to continuously improve and scale our solutions.</p>
            </div>
        </div>
      </Section>
    </>
  );
};

// OurWorkPage Component
const OurWorkPage = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const allTags = [...new Set(MOCK_PROJECTS.flatMap(p => p.tags))];

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? project.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <Section className="bg-blue-50 pt-24 md:pt-32 text-center" id="work-hero">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Our AI-Powered Initiatives</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Explore how ArogyaAI is applying artificial intelligence to create impactful health solutions for communities in need.
        </p>
      </Section>

      <Section id="projects-gallery">
        <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <input 
                        type="text"
                        placeholder="Search projects..."
                        aria-label="Search projects"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <select 
                    aria-label="Filter projects by category"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
            </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 group">
                <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found"; }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                  <div className="mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-1 mb-1 inline-block group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">{tag}</span>
                    ))}
                  </div>
                  <p className="text-green-600 font-semibold text-sm mb-4">Impact Highlight: <span className="font-normal text-gray-700">{project.impact}</span></p>
                  <button 
                    onClick={() => {
                        // In a real app, you would navigate to a detailed project page
                        // For now, an alert is used as a placeholder.
                        // setCurrentPage(`project/${project.id}`) or similar logic would be used with a router.
                        alert(`Learn more about ${project.title}. \n(Navigation to full project page for ID ${project.id} not implemented in this demo.)`);
                    }}
                    className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105 flex items-center justify-center"
                  >
                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
                <p className="text-gray-500">Try adjusting your search terms or selected category.</p>
            </div>
        )}
      </Section>
    </>
  );
};


// GetInvolvedPage Component
const GetInvolvedPage = ({ setCurrentPage }) => {
  return (
    <>
      <Section className="bg-green-50 pt-24 md:pt-32 text-center" id="involved-hero">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Get Involved & Make an Impact</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Your support, skills, and voice can help us bring AI-driven health solutions to more communities. Join us in our mission.
        </p>
      </Section>

      <Section id="ways-to-contribute">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Volunteer Card (Placeholder) */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
            <Users className="h-16 w-16 text-blue-500 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Volunteer Your Skills</h3>
            <p className="text-gray-600 mb-6 flex-grow">Are you an AI expert, healthcare professional, data scientist, or passionate individual? We welcome volunteers to contribute their expertise. (More info coming soon!)</p>
            <button
              onClick={() => setCurrentPage('contact')}
              className="mt-auto w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105"
            >
              Express Interest
            </button>
          </div>

          {/* Partner Card (Placeholder) */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
            <Zap className="h-16 w-16 text-yellow-500 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Partner With Us</h3>
            <p className="text-gray-600 mb-6 flex-grow">We collaborate with organizations, institutions, and corporations to amplify our impact. Let's explore partnership opportunities. (More info coming soon!)</p>
            <button
              onClick={() => setCurrentPage('contact')}
              className="mt-auto w-full bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105"
            >
              Discuss Partnership
            </button>
          </div>
          {/* Support Our Cause Card */}
          <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center">
            <Heart className="h-16 w-16 text-red-500 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Help Support Our Cause
            </h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Support our mission by spreading awareness, help contribute to our cause, connecting us with communities,
              educators, or healthcare leaders, or helping amplify our impact through outreach
              and advocacy.
            </p>
            <button
              onClick={() => setCurrentPage('contact')}
              className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105"
            >
              Help Support
            </button>
          </div>
        </div>
      </Section>
    </>
  );
};

// EthicalAIPage Component
const EthicalAIPage = ({ setCurrentPage }) => {
  return (
    <>
      <Section className="bg-indigo-50 pt-24 md:pt-32 text-center" id="ethics-hero">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Our Commitment to Ethical AI</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          At ArogyaAI, responsible innovation is paramount. We are dedicated to developing and deploying AI that is fair, transparent, accountable, and beneficial to all.
        </p>
      </Section>

      <Section id="framework-overview">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Ethical AI Framework</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Guiding principles that underpin all our AI initiatives.
            </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Fairness */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CheckCircle className="h-10 w-10 text-green-500 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Fairness & Non-Discrimination</h3>
                <p className="text-gray-600">We actively work to identify and mitigate biases in our data and algorithms to ensure equitable outcomes for all demographic groups.</p>
            </div>
            {/* Card 2: Transparency */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Search className="h-10 w-10 text-blue-500 mb-3"/> {/* Icon changed for visual variety */}
                <h3 className="text-xl font-semibold mb-2">Transparency & Explainability</h3>
                <p className="text-gray-600">We strive to make our AI systems understandable, providing insights into how decisions are made, especially in critical healthcare applications.</p>
            </div>
            {/* Card 3: Accountability */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Users className="h-10 w-10 text-yellow-500 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Human Oversight & Accountability</h3>
                <p className="text-gray-600">Our AI tools are designed to augment human expertise, not replace it. We maintain clear lines of accountability for AI system performance and impact.</p>
            </div>
            {/* Card 4: Privacy */}
             <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Zap className="h-10 w-10 text-purple-500 mb-3"/> {/* Icon changed for visual variety */}
                <h3 className="text-xl font-semibold mb-2">Data Privacy & Security</h3>
                <p className="text-gray-600">Protecting sensitive health data is a top priority. We adhere to stringent data governance and security protocols, complying with relevant regulations.</p>
            </div>
            {/* Card 5: Beneficence */}
             <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Globe className="h-10 w-10 text-red-500 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Beneficence & Societal Well-being</h3>
                <p className="text-gray-600">Our primary goal is to use AI to create positive societal impact, focusing on projects that genuinely improve health and well-being in underserved communities.</p>
            </div>
            {/* Card 6: Engagement */}
             <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <MessageSquare className="h-10 w-10 text-teal-500 mb-3"/>
                <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
                <p className="text-gray-600">We engage with communities to understand their needs and concerns, ensuring our AI solutions are developed and deployed collaboratively and respectfully.</p>
            </div>
        </div>
      </Section>
      <Section id="ethics-cta" className="bg-gray-100">
        <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Learn More or Get Involved</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
                We believe in open discussion about the ethical implications of AI. If you have questions, insights, or wish to collaborate on ethical AI practices, please reach out.
            </p>
            <button onClick={() => setCurrentPage('contact')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md">
                Contact Our Ethics Team
            </button>
        </div>
      </Section>
    </>
  );
};

// ContactPage Component
const ContactPage = ({ setCurrentPage }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState(null); // null, 'sending', 'sent', 'error'
  const [contactErrors, setContactErrors] = useState({});


  const validateContactForm = () => {
    const newErrors = {};
    if (!contactForm.name.trim()) newErrors.name = "Full Name is required.";
    if (!contactForm.email.trim()) {
        newErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
        newErrors.email = "Email address is invalid.";
    }
    if (!contactForm.subject.trim()) newErrors.subject = "Subject is required.";
    if (!contactForm.message.trim()) newErrors.message = "Message is required.";
    setContactErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
    if (contactErrors[name]) {
      setContactErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!validateContactForm()) return;

    setFormStatus('sending');

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbxJfFvlmIxMoASDo_qeoqoJfQpOIwDemL5H5TnXTLyNRk7Qnv4gc2s9eYx296_jLMNRYQ/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact',
            name: contactForm.name,
            email: contactForm.email,
            subject: contactForm.subject,
            message: contactForm.message,
            source: 'website'
          })
        }
      );

      // If fetch doesn't throw → assume success
      setFormStatus('sent');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  return (
    <>
      <Section className="bg-gray-50 pt-24 md:pt-32 text-center" id="contact-hero">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          We'd love to hear from you. Whether you have a question, a partnership, proposal, or want to learn more about our work, please reach out.
        </p>
      </Section>

      <Section id="contact-details">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleContactSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" id="contact-name" autoComplete="name" value={contactForm.name} onChange={handleContactChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${contactErrors.name ? 'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-blue-500'}`} />
                {contactErrors.name && <p className="text-red-500 text-sm mt-1">{contactErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" id="contact-email" autoComplete="email" value={contactForm.email} onChange={handleContactChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${contactErrors.email ? 'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-blue-500'}`} />
                {contactErrors.email && <p className="text-red-500 text-sm mt-1">{contactErrors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" name="subject" id="contact-subject" value={contactForm.subject} onChange={handleContactChange} className={`w-full p-3 border rounded-lg focus:ring-2 ${contactErrors.subject ? 'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-blue-500'}`} />
                {contactErrors.subject && <p className="text-red-500 text-sm mt-1">{contactErrors.subject}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" id="contact-message" value={contactForm.message} onChange={handleContactChange} rows="5" className={`w-full p-3 border rounded-lg focus:ring-2 ${contactErrors.message ? 'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-blue-500'}`}></textarea>
                {contactErrors.message && <p className="text-red-500 text-sm mt-1">{contactErrors.message}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              {formStatus === 'sent' && <p className="text-green-600 flex items-center mt-3"><CheckCircle className="mr-2 h-5 w-5"/> Message sent successfully! We'll be in touch soon.</p>}
              {formStatus === 'error' && <p className="text-red-600 flex items-center mt-3"><XCircle className="mr-2 h-5 w-5"/> An error occurred. Please try again later or email us directly.</p>}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 mt-8 md:mt-0">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-blue-600"/> Email Us</h3>
              <p className="text-gray-600 pl-7 hover:text-blue-600 transition-colors"><a href="mailto:lalithendrareddy.bhima@gmail.com">lalithendrareddy.bhima@gmail.com</a></p>
              <p className="text-gray-600 pl-7 hover:text-blue-600 transition-colors"><a href="mailto:bhavika.bhima@gmail.com">bhavika.bhima@gmail.com</a></p>

            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center"><Users className="mr-2 h-5 w-5 text-blue-600"/> Follow Us</h3>
              <div className="flex space-x-4 pl-7">
                <a
                  href="https://www.youtube.com/@Lalith_B"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ArogyaAI on YouTube"
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                  >
                    <path d="M23.498 6.186a2.958 2.958 0 0 0-2.08-2.09C19.72 3.5 12 3.5 12 3.5s-7.72 0-9.418.596a2.958 2.958 0 0 0-2.08 2.09A30.02 30.02 0 0 0 0 12a30.02 30.02 0 0 0 .502 5.814 2.958 2.958 0 0 0 2.08 2.09C4.28 20.5 12 20.5 12 20.5s7.72 0 9.418-.596a2.958 2.958 0 0 0 2.08-2.09A30.02 30.02 0 0 0 24 12a30.02 30.02 0 0 0-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};


// AI Chatbot Placeholder
const AIChatbotButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none z-50"
      aria-label="Open AI Chatbot Assistant"
    >
      <Bot size={28} />
    </button>
  );
};

const AIChatbotModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  // Basic chatbot interaction logic 
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello! I'm the ArogyaAI Assistant. How can I help you today?" }
  ]);

  const handleChatSend = () => {
    if (chatInput.trim() === '') return;
    const newMessages = [...chatMessages, { sender: 'user', text: chatInput }];
    // Simulate bot response
    setTimeout(() => {
        newMessages.push({ sender: 'bot', text: `I've received your message: "${chatInput}". As a conceptual assistant, I'm still learning!`});
        setChatMessages(newMessages);
    }, 1000);
    setChatMessages(newMessages);
    setChatInput('');
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 z-[100] sm:items-center" onClick={onClose}> {/* Close on overlay click */}
      <div 
        className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bot size={28} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">ArogyaAI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close chat">
            <X size={24} />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
            {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
        
        {/* Quick Replies*/}
        <div className="p-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 text-center">Suggested questions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={() => setChatInput('What projects are you working on?')} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Projects?</button>
                <button
                  onClick={() => setChatInput('How can I support your mission?')}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  Support?
                </button>
                <button onClick={() => setChatInput('Ethical AI principles?')} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Ethics?</button>
            </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input 
                type="text" 
                placeholder="Type your question..." 
                aria-label="Type your question for the chatbot"
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
            />
            <button 
                onClick={handleChatSend}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-md transition-colors"
                aria-label="Send chat message"
            >
                <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Default page
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Effect to scroll to top when currentPage changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutUsPage setCurrentPage={setCurrentPage} />;
      case 'work':
        return <OurWorkPage setCurrentPage={setCurrentPage} />;
      case 'involved':
        return <GetInvolvedPage setCurrentPage={setCurrentPage} />;
      case 'ethics':
        return <EthicalAIPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      default:
        // Fallback for any unknown page, or if project/:id routing was attempted without a router
        if (currentPage.startsWith('project/')) {
            // Simple handling for project links, could show a specific message or redirect
            // alert(`Project detail page for ${currentPage} is not yet implemented.`);
            return <OurWorkPage setCurrentPage={setCurrentPage} />; // Go back to projects list
        }
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    // The `font-sans` class from Tailwind applies a system sans-serif font stack.
    // `antialiased` improves text rendering.
    // `bg-gray-100` sets a light gray background for the entire page body.
    // `text-gray-900` sets the default text color.
    <div className="font-sans antialiased text-gray-900 bg-gray-100">
      <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
      {/* The main content area that will change based on the current page. 
          `min-h-screen` ensures that the main content area takes at least the full height of the screen,
          which helps in keeping the footer at the bottom even on pages with little content. */}
      <main className="min-h-screen">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
      <AIChatbotButton onClick={() => setIsChatbotOpen(true)} />
      <AIChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default App;
