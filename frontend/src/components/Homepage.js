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
      navigate("/auth");
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