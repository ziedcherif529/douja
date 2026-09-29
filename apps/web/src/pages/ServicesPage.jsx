import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Stethoscope, Syringe, Activity, AlertCircle, TrendingUp, Heart, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const services = [
  {
    icon: Stethoscope,
    title: 'Diagnostics',
    description: 'Comprehensive health assessments and diagnostic services to identify conditions early and accurately.',
    features: [
      'Complete physical examinations',
      'Blood work and laboratory analysis',
      'Ultrasound imaging',
      'Radiography (X-rays)',
      'Endoscopy procedures',
      'Lameness evaluations'
    ],
    pricing: 'From 150 TND'
  },
  {
    icon: Activity,
    title: 'Surgery',
    description: 'Expert surgical interventions performed with precision, from routine procedures to complex operations.',
    features: [
      'Soft tissue surgery',
      'Orthopedic procedures',
      'Colic surgery',
      'Wound repair and reconstruction',
      'Castration',
      'Tumor removal'
    ],
    pricing: 'From 800 TND'
  },
  {
    icon: Syringe,
    title: 'Vaccination',
    description: 'Complete vaccination programs tailored to your horse\'s needs and activity level.',
    features: [
      'Core vaccinations (Tetanus, EEE, WEE)',
      'Influenza and Rhinopneumonitis',
      'West Nile Virus protection',
      'Rabies vaccination',
      'Custom vaccination schedules',
      'Travel health certificates'
    ],
    pricing: 'From 80 TND per vaccine'
  },
  {
    icon: AlertCircle,
    title: 'Emergency Care',
    description: '24/7 emergency response for critical situations requiring immediate medical attention.',
    features: [
      'Colic management',
      'Laceration repair',
      'Eye emergencies',
      'Respiratory distress',
      'Fracture stabilization',
      'Poisoning treatment'
    ],
    pricing: 'Emergency call-out: 300 TND'
  },
  {
    icon: TrendingUp,
    title: 'Performance Monitoring',
    description: 'Regular health checks and assessments to keep competition horses in peak condition.',
    features: [
      'Pre-purchase examinations',
      'Fitness evaluations',
      'Gait analysis',
      'Nutritional counseling',
      'Training program optimization',
      'Performance enhancement strategies'
    ],
    pricing: 'From 250 TND'
  },
  {
    icon: Heart,
    title: 'Rehabilitation',
    description: 'Specialized recovery programs designed to restore health and mobility after injury or illness.',
    features: [
      'Post-surgical care',
      'Physical therapy protocols',
      'Hydrotherapy',
      'Controlled exercise programs',
      'Pain management',
      'Return-to-work planning'
    ],
    pricing: 'From 200 TND per session'
  }
];

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Veterinary Services | BAVET</title>
        <meta name="description" content="Comprehensive equine veterinary services including diagnostics, surgery, vaccination, emergency care, performance monitoring, and rehabilitation. Expert care for your horses." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 
                className="text-5xl md:text-6xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em', textBalance: 'balance' }}
              >
                Veterinary services
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive medical care for horses, from preventive health to advanced treatments
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-border hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {service.title}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">
                        {service.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Services include:</h4>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-semibold text-primary">
                            {service.pricing}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 text-center"
            >
              <Card className="max-w-3xl mx-auto border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Need a consultation?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Contact us to discuss your horse's specific needs and schedule an appointment. We're here to provide the best possible care.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All prices are indicative and may vary based on specific requirements. Emergency services available 24/7.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;