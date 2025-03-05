
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bus, TramFront, SquareM } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransportCard } from "@/components/TransportCard";
import { useAuth } from "@/components/Auth";
import { Navbar } from "@/components/Navbar";
import { api } from "@/lib/api";

export type Category = {
  id: string;
  name: string;
  version: number;
};

export type Line = {
  id: string;
  name: string;
  creation: string;
  category: {
    id: string,
    name:string
  };
  type: string;
  debut_activite?: string;
  fin_activite?: string;
  stops: Stop[];
};

export type Stop = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [lines, setLines] = useState<Record<string, Line[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = await api.getCategories();
        setCategories(categoriesData);
        // Fetch lines for each category
        const linesData: Record<string, Line[]> = {};
        for (const category of categoriesData) {
          const categoryLines = await api.getLinesByCategory(category.id);
          linesData[category.id] = categoryLines;
        }
        console.log(linesData)
        setLines(linesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  // Helper pour obtenir toutes les lignes
  const getAllLines = () => {
    return Object.values(lines).flat();
  };

  const getDisplayedLines = () => {
    if (activeTab === "all") return getAllLines();
    return lines[activeTab] || [];
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case "Bus":
        return <Bus className="h-5 w-5" />;
      case "Tramway":
        return <TramFront className="h-5 w-5" />;
      case "Métro":
        return <SquareM className="h-5 w-5" />;
      default:
        return <Bus className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground mt-1">
                Bienvenue, {user?.username || "utilisateur"}! Explorez les transports disponibles.
              </p>
            </motion.div>
          </div>
          
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Chargement des données...</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="glass-panel">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      Tous
                    </TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="flex items-center gap-2"
                      >
                        {getCategoryIcon(category.name)}
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <TabsContent value="all">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {getAllLines().map((line) => (
                      <motion.div key={line.id} variants={itemVariants}>
                        <TransportCard
                          id={line.id}
                          name={line.name}
                          type={line.category.name}
                          categoryId={line.category.id}
                          stopsCount={line.stops ? line.stops.length : 0}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
                
                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible" 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {(lines[category.id] || []).map((line) => (
                        <motion.div key={line.id} variants={itemVariants}>
                          <TransportCard
                            id={line.id}
                            name={line.name}
                            type={line.category.name}
                            categoryId={line.category.id}
                            stopsCount={line.stops ? line.stops.length : 0}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
