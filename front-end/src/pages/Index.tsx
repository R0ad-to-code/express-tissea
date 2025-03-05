
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Bus, Train, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/Auth";

// Ajout de la dépendance framer-motion pour les animations
<lov-add-dependency>framer-motion@10.16.4</lov-add-dependency>

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Variantes d'animation pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const featureCards = [
    {
      icon: <Bus className="h-10 w-10 text-transport-bus" />,
      title: "Transport urbain",
      description: "Trouvez facilement les lignes de bus, tram et métro de votre ville",
    },
    {
      icon: <Train className="h-10 w-10 text-transport-metro" />,
      title: "Information en temps réel",
      description: "Consultez les horaires, les arrêts et les informations détaillées",
    },
    {
      icon: <Route className="h-10 w-10 text-transport-tram" />,
      title: "Planification d'itinéraire",
      description: "Calculez la distance entre les arrêts et planifiez vos déplacements",
    },
  ];


  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-transport-metro">
              Explorez la mobilité urbaine
            </h1>
            <p className="text-xl text-muted-foreground mb-8 px-4">
              Découvrez toutes les lignes de transport en commun, leurs arrêts et itinéraires en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" className="w-full sm:w-auto">
                  {isAuthenticated ? "Accéder au tableau de bord" : "Commencer maintenant"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ce que vous pouvez faire</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre application vous offre une suite d'outils pour explorer et comprendre les réseaux de transport.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 rounded-xl flex flex-col items-center text-center"
                variants={itemVariants}
              >
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl font-bold mb-4">Une expérience utilisateur repensée</h2>
              <p className="text-muted-foreground mb-6">
                Notre interface intuitive et élégante vous permet de naviguer facilement dans les données de transport, de visualiser les itinéraires et de planifier vos déplacements comme jamais auparavant.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Visualisation des arrêts sur la carte",
                  "Détails complets des lignes",
                  "Calcul de distances",
                  "Interface intuitive et réactive",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" className="w-full sm:w-auto">
                  {isAuthenticated ? "Accéder au tableau de bord" : "Commencer maintenant"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="glass-card p-2 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-muted/30 rounded-lg aspect-[3/2]">
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Aperçu de l'application</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto">
          <motion.div className="text-center max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold mb-4">Prêt à explorer les transports urbains ?</h2>
            <p className="text-muted-foreground mb-8">
              Inscrivez-vous maintenant et commencez à explorer les réseaux de transport en commun.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button size="lg">
                {isAuthenticated ? "Accéder au tableau de bord" : "S'inscrire gratuitement"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Bus className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-lg">TransitExplorer</span>
            </div>
            <div className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} TransitExplorer. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
