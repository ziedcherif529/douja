import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              BAVET
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Clinique vétérinaire spécialisée, dédiée à fournir des soins vétérinaires exceptionnels pour les chevaux avec une expertise médicale avancée et un service compatissant.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Coordonnées</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">Tunis, Tunisie</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">(+216) 58 050 691</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">+33 6 82 55 91 04</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">ahmed.bah95@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Horaires</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Lundi - Vendredi : 8h00 - 18h00</p>
              <p>Samedi : 9h00 - 14h00</p>
              <p>Dimanche : Urgences uniquement</p>
            </div>

          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2026 BAVET. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
