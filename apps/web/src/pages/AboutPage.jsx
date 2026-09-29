import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Heart, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const milestones = [
  {
    icon: GraduationCap,
    title: 'Expertise Vétérinaire',
    description: 'Notre équipe de vétérinaires spécialisés est diplômée des plus prestigieuses institutions de médecine vétérinaire, avec une spécialisation en médecine et chirurgie équines.'
  },
  {
    icon: Briefcase,
    title: 'Formation Internationale',
    description: 'Nos vétérinaires ont suivi des formations intensives en France et à l\'international, maîtrisant les techniques chirurgicales et diagnostiques les plus avancées.'
  },
  {
    icon: Award,
    title: 'Expérience Terrain',
    description: 'Une vaste expérience pratique couvrant un large éventail de cas équins, des soins préventifs de routine aux interventions d\'urgence complexes.'
  },
  {
    icon: Heart,
    title: 'Passion des Chevaux',
    description: 'Nous allions excellence scientifique et soins compatissants, assurant à chaque cheval le meilleur traitement possible dans un environnement bienveillant.'
  }
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>À propos de BAVET | Clinique Vétérinaire Équine</title>
        <meta name="description" content="Découvrez BAVET, votre clinique vétérinaire équine en Tunisie. Une équipe de spécialistes dédiée à la santé et au bien-être des chevaux." />
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
                À propos de BAVET
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Une équipe dédiée, une expertise reconnue, un engagement sans faille pour la santé équine
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="aspect-[4/3] bg-primary/10 rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a" 
                    alt="Vétérinaire examinant un cheval"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <h2 
                  className="text-3xl md:text-4xl font-bold text-foreground"
                  style={{ fontFamily: 'Playfair Display, serif', textBalance: 'balance' }}
                >
                  Notre clinique
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    BAVET est une clinique vétérinaire spécialisée en médecine équine, fondée par une équipe de vétérinaires passionnés, diplômés de l'École Nationale de Médecine Vétérinaire de Sidi Thabet, l'une des institutions vétérinaires les plus prestigieuses de Tunisie.
                  </p>
                  <p>
                    Pour enrichir notre expertise, nous avons poursuivi des formations avancées en Normandie, France, une région réputée pour son patrimoine équestre. Aux côtés de spécialistes de renom, nous avons maîtrisé les techniques diagnostiques et chirurgicales de pointe, acquérant des connaissances précieuses en médecine du cheval de sport.
                  </p>
                  <p>
                    Notre expérience pratique a été enrichie par des stages intensifs à Ben Guerdane, Tunisie, où nous avons rencontré un large éventail de cas — des soins préventifs de routine aux interventions d'urgence complexes. Cette diversité d'exposition a façonné notre approche holistique de la santé équine.
                  </p>
                  <p>
                    Aujourd'hui, BAVET met ce capital de connaissances et d'expérience au service de chaque consultation, alliant les meilleures pratiques internationales à une compréhension approfondie des conditions et besoins locaux.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-border">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <milestone.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
                style={{ fontFamily: 'Playfair Display, serif', textBalance: 'balance' }}
              >
                Notre philosophie
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                "Chaque cheval mérite le plus haut niveau de soins médicaux, prodigués avec expertise, compassion et respect. Notre mission est d'assurer à chaque animal une attention personnalisée, alliant les dernières avancées de la science vétérinaire à une compréhension profonde de ses besoins individuels."
              </p>
              <p className="text-base text-muted-foreground italic">
                — L'équipe BAVET
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
