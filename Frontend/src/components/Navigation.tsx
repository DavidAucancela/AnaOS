import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const scrollInformation = () => {
    document.getElementById('information')?.scrollIntoView({
      behavior: 'smooth'
    });
    setMobileMenuOpen(false);
  };
  
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth'
    });
    setMobileMenuOpen(false);
  };
  
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({
      behavior: 'smooth'
    });
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#1A2332] hover:text-[#0066FF] transition-colors">
          Ana-OS
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={scrollInformation} 
            className="text-gray-700 hover:text-[#0066FF] transition-colors font-medium text-sm"
          >
            Información
          </button>
          <button 
            onClick={scrollToFeatures} 
            className="text-gray-700 hover:text-[#0066FF] transition-colors font-medium text-sm"
          >
            Características
          </button>
          <button 
            onClick={scrollToPricing} 
            className="text-gray-700 hover:text-[#0066FF] transition-colors font-medium text-sm"
          >
            Precios
          </button>
          
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-[#0066FF] transition-colors font-medium text-sm"
              >
                Ingresar
              </Link>
              <button 
                onClick={scrollToPricing} 
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
              >
                Comenzar
              </button>
            </>
          )}
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2 text-gray-700 hover:text-[#0066FF] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 animate-in slide-in-from-top">
          <button 
            onClick={scrollInformation} 
            className="block w-full text-left text-gray-700 hover:text-[#0066FF] transition-colors font-medium py-2"
          >
            Información
          </button>
          <button 
            onClick={scrollToFeatures} 
            className="block w-full text-left text-gray-700 hover:text-[#0066FF] transition-colors font-medium py-2"
          >
            Características
          </button>
          <button 
            onClick={scrollToPricing} 
            className="block w-full text-left text-gray-700 hover:text-[#0066FF] transition-colors font-medium py-2"
          >
            Precios
          </button>
          
          {user ? (
            <Link 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block w-full text-center bg-[#0066FF] text-white px-4 py-2 rounded-lg font-semibold mt-4 hover:bg-[#0052CC] transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block w-full text-left text-gray-700 hover:text-[#0066FF] transition-colors font-medium py-2"
              >
                Ingresar
              </Link>
              <button 
                onClick={scrollToPricing} 
                className="block w-full text-center bg-[#0066FF] text-white px-4 py-2 rounded-lg font-semibold mt-4 hover:bg-[#0052CC] transition-colors"
              >
                Comenzar
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;