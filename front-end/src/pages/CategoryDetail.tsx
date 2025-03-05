
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bus, TramFront, SquareM, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransportCard } from "@/components/TransportCard";
import { Navbar } from "@/components/Navbar";
import { api } from "@/lib/api";
import { Category, Line, Stop} from "./Dashboard"


const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const categoryData = await api.getInfosByCategory(categoryId);
        setCategory(categoryData[0]);
        const linesData = await api.getLinesByCategory(categoryId);
        setLines(linesData);
        console.log(lines)
      } catch (error) {
        console.error("Failed to fetch category data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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

  const getCategoryIcon = (type?: string) => {
    switch (type) {
      case "bus":
        return <Bus className="h-6 w-6 text-transport-bus" />;
      case "Tramway":
        return <TramFront className="h-6 w-6 text-transport-tram" />;
      case "Métro":
        return <SquareM className="h-6 w-6 text-transport-metro" />;
      default:
        return <Bus className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 pt-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4"
              asChild
            >
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            
            {loading ? (
              <div className="h-12 w-full animate-pulse rounded-md bg-muted"></div>
            ) : category ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  {getCategoryIcon(category.name)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{category.name}</h1>
                  <p className="text-muted-foreground">{lines.length} lignes disponibles</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-destructive/10 text-destructive">
                <Info className="h-5 w-5" />
                <p>Catégorie introuvable</p>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="h-48 animate-pulse rounded-xl bg-muted"
                ></div>
              ))}
            </div>
          ) : lines.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {lines.map((line) => (
                <motion.div key={line.id} variants={itemVariants}>
                  <TransportCard
                    id={line.id}
                    name={line.name}
                    type={line.name}
                    categoryId={category?.id || ""}
                    stopsCount={line.stops ? line.stops.length : 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-muted-foreground">
                <p>Aucune ligne disponible pour cette catégorie.</p>
              </div>
              <Button asChild>
                <Link to="/dashboard">Voir toutes les lignes</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;
