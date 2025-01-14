import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to JBM Manufacturing
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Driving Excellence in Manufacturing and Engineering Solutions
          </p>
          <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Learn More
          </button>
        </div>
      </header>

      {/* About Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600">
              At JBM Manufacturing, we specialize in delivering high-quality industrial solutions for diverse sectors. 
              With decades of experience, our commitment to innovation and excellence sets us apart.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600">
              Tailored solutions designed to meet your unique business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg">
              <h3 className="text-xl font-bold">Custom Manufacturing</h3>
              <p className="mt-2 text-gray-600">
                From prototyping to mass production, we deliver precision-engineered solutions for all industries.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg">
              <h3 className="text-xl font-bold">Engineering Solutions</h3>
              <p className="mt-2 text-gray-600">
                Cutting-edge design and engineering support for your projects.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md hover:shadow-lg">
              <h3 className="text-xl font-bold">Maintenance & Support</h3>
              <p className="mt-2 text-gray-600">
                Comprehensive maintenance and after-sales support to ensure your operations run smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 border rounded-lg shadow-md">
              <p className="italic text-gray-600">
                "JBM Manufacturing consistently delivers exceptional quality and precision. Highly recommend!"
              </p>
              <h4 className="mt-4 font-bold text-blue-900">- John Doe, CEO of XYZ Corp</h4>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <p className="italic text-gray-600">
                "Their team is professional and responsive. Our partnership has been a game-changer."
              </p>
              <h4 className="mt-4 font-bold text-blue-900">- Jane Smith, Operations Manager at ABC Inc</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
          <p className="mt-4 text-lg md:text-xl">
            Have questions? Need more information? We're here to help.
          </p>
          <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} JBM Manufacturing. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
