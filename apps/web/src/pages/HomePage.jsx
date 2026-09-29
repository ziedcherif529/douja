import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Syringe, Activity, AlertCircle, TrendingUp, Heart } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const services = [
  {
    icon: Stethoscope,
    title: 'Diagnostics',
    description: 'Comprehensive health assessments using advanced diagnostic tools and techniques to identify conditions early.'
  },
  {
    icon: Activity,
    title: 'Surgery',
    description: 'Expert surgical interventions performed with precision and care, from routine procedures to complex operations.'
  },
  {
    icon: Syringe,
    title: 'Vaccination',
    description: 'Complete vaccination programs tailored to your horse\'s needs, ensuring protection against common diseases.'
  },
  {
    icon: AlertCircle,
    title: 'Emergency Care',
    description: '24/7 emergency response for critical situations, providing immediate medical attention when it matters most.'
  },
  {
    icon: TrendingUp,
    title: 'Performance Monitoring',
    description: 'Regular health checks and performance assessments to keep your horse in peak condition for competition.'
  },
  {
    icon: Heart,
    title: 'Rehabilitation',
    description: 'Specialized recovery programs designed to restore health and mobility after injury or illness.'
  }
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>BAVET – Clinique Vétérinaire Équine | Soins Experts pour Chevaux en Tunisie</title>
        <meta name="description" content="BAVET provides advanced veterinary care for horses in Tunisia. Specialized in diagnostics, surgery, emergency care, and performance monitoring with passion and precision." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1622656890628-e282191c566e)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em', textBalance: 'balance' }}
              >
                BAVET
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
                Clinique Vétérinaire Équine
              </p>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Soins médicaux avancés pour chevaux avec passion et précision
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="text-lg px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                    Client Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 
                className="text-4xl md:text-5xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'Playfair Display, serif', textBalance: 'balance' }}
              >
                Dédié à l'excellence équine
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  La clinique BAVET réunit une équipe de vétérinaires spécialisés, diplômés des plus prestigieuses institutions de médecine vétérinaire, dédiés à la santé et au bien-être des chevaux.
                </p>
                <p>
                  Nos vétérinaires ont perfectionné leur expertise à travers des formations intensives en France et en Tunisie, travaillant aux côtés de spécialistes équins de renom pour maîtriser les techniques diagnostiques et chirurgicales les plus avancées.
                </p>
                <p>
                  Animés par un engagement envers l'apprentissage continu et les dernières avancées vétérinaires, nous combinons rigueur scientifique et compassion authentique pour chaque cheval sous nos soins.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                style={{ fontFamily: 'Playfair Display, serif', textBalance: 'balance' }}
              >
                Comprehensive veterinary services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From routine care to advanced procedures, we provide complete medical support for your horses
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link to="/services">
                <Button size="lg" variant="outline">
                  View All Services
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;