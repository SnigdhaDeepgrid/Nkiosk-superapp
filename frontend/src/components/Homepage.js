import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="min-h-screen bg-app-gray-200">
      {/* Navigation Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-app-gray-200 shadow-lg py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-2xl font-bold text-coral-red-600">Nkiosk</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-app-gray-700 hover:text-coral-red font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-app-gray-700 hover:text-coral-red font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#industries"
                className="text-app-gray-700 hover:text-coral-red font-medium transition-colors"
              >
                Industries
              </a>
              <a
                href="#services"
                className="text-app-gray-700 hover:text-coral-red font-medium transition-colors"
              >
                Services
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <button
                onClick={handleGetStarted}
                className="bg-coral-red text-white px-6 py-2 rounded-lg hover:bg-coral-red-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-app-gray-700 hover:text-coral-red focus:outline-none"
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
                  className="text-app-gray-700 hover:text-coral-red font-medium"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="text-app-gray-700 hover:text-coral-red font-medium"
                >
                  Features
                </a>
                <a
                  href="#industries"
                  className="text-app-gray-700 hover:text-coral-red font-medium"
                >
                  Industries
                </a>
                <a
                  href="#services"
                  className="text-app-gray-700 hover:text-coral-red font-medium"
                >
                  Services
                </a>
                <button
                  onClick={handleGetStarted}
                  className="bg-coral-red text-white px-6 py-2 rounded-lg hover:bg-coral-red-700 transition-colors font-medium mt-2 self-start"
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Build Your
                <span className="text-[#D94436]"> Multi-Vendor</span>
                <br />
                eCommerce Empire
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto mt-6">
                Launch and scale your marketplace with Nkiosk - connect vendors,
                delight customers, and grow your business.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-[#D94436] text-white px-8 py-4 rounded-md hover:bg-red-800 transition-colors font-semibold text-lg"
                >
                  Start Free Trial
                </button>
                <button className="border-2 border-[#D94436] text-[#D94436] px-8 py-4 rounded-md hover:bg-red-800 hover:text-white transition-colors font-semibold text-lg">
                  Book a Demo
                </button>
              </div>
            </div>

            {/* Red Strip */}
            <div className="absolute bottom-0 w-full h-28 bg-[#D94436]"></div>

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
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You Get with Nkiosk
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to launch and scale your multi-vendor
              marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📊",
                title: "Centralized Platform",
                description:
                  "Manage all vendors, products, and orders from one unified dashboard with complete control and visibility.",
              },
              {
                icon: "📈",
                title: "Real-time Analytics",
                description:
                  "Track sales, monitor performance, and make data-driven decisions with comprehensive analytics and reports.",
              },
              {
                icon: "👥",
                title: "Vendor Management",
                description:
                  "Onboard, manage, and support unlimited vendors with automated approval workflows and commission tracking.",
              },
              {
                icon: "📱",
                title: "Mobile Apps",
                description:
                  "Native mobile apps for customers, vendors, and delivery partners with seamless user experience.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nkiosk powers marketplaces across diverse industries and business
              types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🥬",
                title: "Grocery & Food",
                description:
                  "Fresh produce, packaged goods, and specialty food items with inventory management.",
              },
              {
                icon: "💊",
                title: "Pharmacy & Health",
                description:
                  "Prescription medicines, health products, and medical supplies with compliance features.",
              },
              {
                icon: "📱",
                title: "Electronics & Tech",
                description:
                  "Latest gadgets, smartphones, computers, and tech accessories with warranty management.",
              },
              {
                icon: "🍽️",
                title: "Food Delivery",
                description:
                  "Restaurant partnerships, food delivery, and meal ordering with real-time tracking.",
              },
            ].map((industry, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4">{industry.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {industry.title}
                  </h3>
                  <p className="text-gray-600">{industry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Build Your eCommerce Empire Today
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Join thousands of successful marketplace owners who chose Nkiosk to
            power their business. Start your journey to eCommerce success today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
            >
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              Schedule Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">30 Days</div>
              <div className="text-blue-200">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">No Setup</div>
              <div className="text-blue-200">Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="text-2xl font-bold text-white mb-4">Nkiosk</div>
              <p className="text-gray-400 mb-6 max-w-md">
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
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#industries"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Industries
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Services
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
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <div className="text-gray-400 text-sm">
              © 2024 Nkiosk. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
