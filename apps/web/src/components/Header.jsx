import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth.js';
import { LogOut, User, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isClient, logout, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [];
  if (!isAuthenticated) {
    navLinks.push({ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/services', label: 'Services' }, { to: '/contact', label: 'Contact' });
  }
  if (isClient) {
    navLinks.push({ to: '/client/dashboard', label: 'Dashboard' }, { to: '/client/horses', label: 'My Horses' }, { to: '/client/invoices', label: 'Invoices' });
  }
  if (isAdmin) {
    navLinks.push({ to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/clients', label: 'Clients' }, { to: '/admin/users', label: 'Users' }, { to: '/admin/operations', label: 'Operations' }, { to: '/admin/invoices', label: 'Invoices' });
  }

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                BV
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                BAVET
              </h1>
              <p className="text-xs text-muted-foreground">Clinique Vétérinaire</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.to) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link to="/login">
                <Button className="gap-2">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden md:block">
                  {currentUser?.name}
                </span>
                <Button onClick={logout} variant="outline" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                  isActive(link.to) ? 'text-primary bg-primary/5' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <div className="pt-2 border-t border-border">
                <span className="block px-3 py-1 text-xs text-muted-foreground">{currentUser?.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;