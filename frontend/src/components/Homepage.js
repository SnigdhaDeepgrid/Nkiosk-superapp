import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RoleBasedLogin from "./auth/RoleBasedLogin";

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // Scroll to the role-based login section instead of navigating to /auth
      setTimeout(() => {
        const dashboardsSection = document.getElementById('dashboards');
        if (dashboardsSection) {
          dashboardsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA]">
      {/* Navigation Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#EAEAEA] shadow-lg py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-2xl font-bold text-[#D94436]">Nkiosk</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-[#2E2E2E] hover:text-[#D94436] font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-[#2E2E2E] hover:text-[#D94436] font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#industries"
                className="text-[#2E2E2E] hover:text-[#D94436] font-medium transition-colors"
              >
                Industries
              </a>
              <a
                href="#dashboards"
                className="text-[#2E2E2E] hover:text-[#D94436] font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => {
                    const dashboardsSection = document.getElementById('dashboards');
                    if (dashboardsSection) {
                      dashboardsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 100);
                }}
              >
                Dashboards
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <button
                onClick={handleGetStarted}
                className="bg-[#D94436] text-white px-6 py-2 rounded-lg hover:bg-[#C53529] transition-colors font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#2E2E2E] hover:text-[#F25C44] focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                <a
                  href="#home"
                  className="text-[#2E2E2E] hover:text-[#F25C44] font-medium"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="text-[#2E2E2E] hover:text-[#F25C44] font-medium"
                >
                  Features
                </a>
                <a
                  href="#industries"
                  className="text-[#2E2E2E] hover:text-[#F25C44] font-medium"
                >
                  Industries
                </a>
                <a
                  href="#dashboards"
                  className="text-[#2E2E2E] hover:text-[#F25C44] font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => {
                      const dashboardsSection = document.getElementById('dashboards');
                      if (dashboardsSection) {
                        dashboardsSection.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }, 100);
                    setIsMenuOpen(false); // Close mobile menu after clicking
                  }}
                >
                  Dashboards
                </a>
                <button
                  onClick={handleGetStarted}
                  className="bg-[#F25C44] text-white px-6 py-2 rounded-lg hover:bg-[#D94436] transition-colors font-medium mt-2 self-start"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-20 lg:pt-24 bg-[#EAEAEA] overflow-hidden pb-5 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/herobg.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 items-center mt-17">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight mb-6">
                Build Your
                <span className="text-[#D94436]"> Multi-Vendor</span>
                <br />
                eCommerce Empire
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-[#737373] mb-10 leading-relaxed max-w-2xl mx-auto mt-6">
                Launch and scale your marketplace with Nkiosk - connect vendors,
                delight customers, and grow your business.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-[#F25C44] text-white px-8 py-4 rounded-md hover:bg-[#D94436] transition-colors font-semibold text-lg"
                >
                  Start Free Trial
                </button>
                <button 
                  className="border-2 border-[#F25C44] text-[#F25C44] px-8 py-4 rounded-md hover:bg-[#F25C44] hover:text-white transition-colors font-semibold text-lg"
                  onClick={handleGetStarted}
                >
                  Book a Demo
                </button>
              </div>
            </div>

            {/* Red Strip */}
            <div className="absolute bottom-0 w-full h-28 bg-[#F25C44]"></div>

            {/* Center Image */}
            <div className="relative z-10">
              <img
                src="/images/supplies.png"
                alt="Hero"
                className="w-full max-w-sm mx-auto"
              />
            </div>

            {/* Side Illustrations */}
            <img
              src="/images/creditcard.png"
              alt="Cart Illustration"
              className="absolute -bottom-9 left-0 w-20 md:w-44 lg:w-56"
            />
            <img
              src="/images/mobilecart.png"
              alt="Mobile Illustration"
              className="absolute -bottom-9 right-0 w-40 md:w-56 lg:w-72"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] w-full">
          {/* Left Side - About NKIOSK */}
          <div className="bg-[#2E2E2E] text-white p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-2">ABOUT</h2>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#FF6B47] mb-12">
              NKIOSK
            </h2>

            <p className="text-lg lg:text-xl leading-relaxed text-gray-300">
              Nkiosk empowers businesses to launch and scale online marketplaces
              with ease. From grocery to electronics, it unites vendors,
              streamlines orders, and delivers great customer experiences.
            </p>
          </div>

          {/* Right Side - What You Get */}
          <div className="p-12 lg:p-16 flex flex-col justify-center bg-white">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2E2E2E] mb-4 text-center lg:text-left">
              WHAT YOU GET
              <br />
              WITH NKIOSK
            </h2>
            <div className="w-16 h-1 bg-[#FF6B47] mb-12 mx-auto lg:mx-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: "📊",
                  title: "Centralized Platform",
                  description:
                    "Manage all vendors, products, and orders from one unified dashboard.",
                },
                {
                  icon: "👥",
                  title: "Vendor Management",
                  description:
                    "Onboard and manage unlimited vendors with automated workflows.",
                },
                {
                  icon: "📱",
                  title: "Mobile Experience",
                  description:
                    "Native mobile apps for customers, vendors, and delivery partners.",
                },
                {
                  icon: "⚡",
                  title: "Real-time Analytics",
                  description:
                    "Track sales and make data-driven decisions with comprehensive reports.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-[#EAEAEA] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B47] to-[#FF8A47] rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              Industries We Support
            </h2>
            <p className="text-xl text-[#737373] max-w-3xl mx-auto">
              Nkiosk powers marketplaces across diverse industries and business
              types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center",
                title: "Grocery & Food",
                description:
                  "Fresh produce, packaged goods, and specialty food items with inventory management.",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop&crop=center",
                title: "Pharmacy & Health",
                description:
                  "Prescription medicines, health products, and medical supplies with compliance features.",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center",
                title: "Electronics & Tech",
                description:
                  "Latest gadgets, smartphones, computers, and tech accessories with warranty management.",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center",
                title: "Food Delivery",
                description:
                  "Restaurant partnerships, food delivery, and meal ordering with real-time tracking.",
              },
            ].map((industry, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={industry.image}
                    alt={industry.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">
                    {industry.title}
                  </h3>
                  <p className="text-[#737373]">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Login Section */}
      <div id="dashboards">
        <RoleBasedLogin />
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#F25C44] to-[#D94436]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Build Your eCommerce Empire Today
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Join thousands of successful marketplace owners who chose Nkiosk to
            power their business. Start your journey to eCommerce success today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={handleGetStarted}
              className="bg-white text-[#F25C44] px-8 py-4 rounded-lg hover:bg-[#F5F5F5] transition-colors font-semibold text-lg shadow-lg"
            >
              Start Free Trial
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#F25C44] transition-colors font-semibold text-lg"
              onClick={handleGetStarted}
            >
              Schedule Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">30 Days</div>
              <div className="text-white/80">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">No Setup</div>
              <div className="text-white/80">Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2E2E2E] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="text-2xl font-bold text-white mb-4">Nkiosk</div>
              <p className="text-[#A3A3A3] mb-6 max-w-md">
                Empowering businesses to build successful multi-vendor
                marketplaces with cutting-edge technology and comprehensive
                support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#industries"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Industries
                  </a>
                </li>
                <li>
                  <a
                    href="#dashboards"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimeout(() => {
                        const dashboardsSection = document.getElementById('dashboards');
                        if (dashboardsSection) {
                          dashboardsSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }, 100);
                    }}
                  >
                    Dashboards
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#525252] mt-12 pt-8 text-center">
            <div className="text-[#A3A3A3] text-sm">
              © 2024 Nkiosk. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;