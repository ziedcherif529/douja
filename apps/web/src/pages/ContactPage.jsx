import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Contact form data:', data);
    toast.success('Message sent successfully. We will contact you soon.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact BAVET | Prendre Rendez-vous</title>
        <meta name="description" content="Contactez BAVET pour des services vétérinaires équins. Prenez rendez-vous ou contactez-nous pour les urgences. Situé à Tunis, Tunisie." />
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
                Contactez-nous
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Des questions ou besoin de prendre rendez-vous ? Nous sommes là pour vous aider.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-border">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Envoyez-nous un message
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          {...register('name', { required: 'Le nom est requis' })}
                          placeholder="Votre nom"
                          className="text-foreground"
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email', { 
                            required: 'L\'email est requis',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Adresse email invalide'
                            }
                          })}
                          placeholder="votre@email.com"
                          className="text-foreground"
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="(+216) XX XXX XXX"
                          className="text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          {...register('message', { required: 'Le message est requis' })}
                          placeholder="Parlez-nous de votre cheval et comment nous pouvons vous aider"
                          rows={6}
                          className="text-foreground"
                        />
                        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-8"
              >
                <Card className="border-border">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Informations de contact
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                          <p className="text-muted-foreground">Tunis, Tunisie</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                          <p className="text-muted-foreground">(+216) 58 050 691</p>
                          <p className="text-sm text-muted-foreground mt-1">Ligne d'urgence disponible 24h/24</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                          <p className="text-muted-foreground">+33 6 82 55 91 04</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Email</h3>
                          <p className="text-muted-foreground">ahmed.bah95@gmail.com</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Horaires</h3>
                          <div className="text-muted-foreground space-y-1">
                            <p>Lundi - Vendredi : 8h00 - 18h00</p>
                            <p>Samedi : 9h00 - 14h00</p>
                            <p>Dimanche : Urgences uniquement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Services d'urgence
                    </h3>
                    <p className="text-muted-foreground">
                      Pour les situations médicales urgentes nécessitant une attention immédiate, veuillez appeler notre ligne d'urgence. Nous assurons une réponse d'urgence 24h/24 pour les cas critiques.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;