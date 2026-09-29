import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, Activity, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/formatDate.js';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const HorseDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [horse, setHorse] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    fetchHorseDetails();
  }, [id]);

  const fetchHorseDetails = async () => {
    try {
      setLoading(true);
      const horseData = await pb.collection('horses').getOne(id, { $autoCancel: false });
      setHorse(horseData);

      const records = await pb.collection('medical_records').getFullList({
        filter: `horseId = "${id}"`,
        sort: '-record_date',
        $autoCancel: false
      });
      setMedicalRecords(records);
    } catch (error) {
      console.error('Error fetching horse details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${horse?.name || 'Horse'} Details | BAVET`}</title>
        <meta name="description" content="View detailed information and medical history for your horse." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/client/horses">
              <Button variant="ghost" className="gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Horses
              </Button>
            </Link>

            {loading ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-8">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              </div>
            ) : !horse ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Horse not found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-3xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {horse.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Basic Information</h4>
                          <div className="space-y-2">
                            {horse.breed && (
                              <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Breed:</span> {horse.breed}
                              </p>
                            )}
                            {horse.age && (
                              <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Age:</span> {horse.age} years
                              </p>
                            )}
                            {horse.color && (
                              <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Color:</span> {horse.color}
                              </p>
                            )}
                            {horse.microchip && (
                              <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Microchip:</span> {horse.microchip}
                              </p>
                            )}
                          </div>
                        </div>
                        {horse.notes && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Notes</h4>
                            <p className="text-muted-foreground">{horse.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Medical History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {medicalRecords.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No medical records yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {medicalRecords.map(record => (
                            <div key={record.id} className="p-4 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-foreground">
                                  {record.diagnosis || 'Medical Record'}
                                </h4>
                                {record.record_date && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(record.record_date)}
                                  </div>
                                )}
                              </div>
                              {record.treatment_plan && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  <span className="font-medium text-foreground">Treatment:</span> {record.treatment_plan}
                                </p>
                              )}
                              {record.notes && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">Notes:</span> {record.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HorseDetailPage;