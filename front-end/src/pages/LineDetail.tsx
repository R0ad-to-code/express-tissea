
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bus, Route, Clock, Map, Info, Ruler, TramFront, SquareM, Lectern } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapView } from "@/components/MapView";
import { Navbar } from "@/components/Navbar";
import { api } from "@/lib/api";
import {Line, Stop} from "./Dashboard"
import { useAuth } from "@/components/Auth";

const LineDetail = () => {
  const { isAdmin } = useAuth();
  const { categoryId, lineId } = useParams<{ categoryId: string; lineId: string }>();
  const [line, setLine] = useState<Line | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newStopName, setNewStopName] = useState("");
  const [newOrder, setNewOrder] = useState(0);
  const [newLat, setNewLat] =  useState("43°37'13.6");
  const [newLong, setNewLong] =  useState("1°26'09.2");
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(""); 
  const [editableStart, setEditableStart] = useState("");
  const [editableEnd, setEditableEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId || !lineId) return;
      try {
        const lineData = await api.getLineDetails(categoryId, lineId);
        setLine(lineData);
        setEditableName(lineData.name); 
        setEditableStart(lineData.debut_activite); 
        setEditableEnd(lineData.fin_activite); 
        setStops(lineData.stops);
        const distanceData = await api.getLineDistance(lineId);
        setDistance(distanceData.distance);
      } catch (error) {
        console.error("Failed to fetch line data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, lineId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

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

  const getLineIcon = (type?: string) => {
    switch (type) {
      case "Bus":
        return <Bus className="h-5 w-5" />;
      case "TramFrontway":
        return <TramFront className="h-5 w-5" />;
      case "Métro":
        return <SquareM className="h-5 w-5" />;
      default:
        return <Bus className="h-5 w-5" />;
    }
  };

  const getLineClass = (type?: string) => {
    switch (type) {
      case "bus":
        return "transport-bus-gradient";
      case "TramFrontway":
        return "transport-tram-gradient";
      case "Métro":
        return "transport-metro-gradient";
      default:
        return "transport-gradient";
    }
  };

  const deleteStop = async (stopId: string) => {
    if (stopId) {
      console.log(`delete stop ${stopId}`)
      try {
        await api.deleteStop(categoryId, lineId, stopId);
        setStops(stops.filter((stop) => stop.id !== stopId));
      } catch (error) {
        console.error("Failed to delete stop", error);
      }
    }
  }

   const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addStopToLine(categoryId, lineId, {name: newStopName, order : newOrder, latitude : newLat, longitude: newLong});
    } catch (error) {
      console.log("New stop could not be added", error);
    } finally {
      const stops = await api.getLineStops(categoryId, lineId);
      setStops(stops);
    }
    setNewStopName("");
    setNewOrder(0);
    setNewLat("");
    setNewLong("");
    setShowForm(false);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save the changes when switching back to non-edit mode
      const updatedLine = { name: editableName, debut_activite: editableStart, fin_activite: editableEnd };
      api.updateLine(categoryId, lineId, updatedLine)
        .catch((error) => console.error("Error saving line data:", error));
        const returnedLines = await api.getLineDetails(categoryId, lineId);
        setLine(returnedLines);
    }
    setIsEditing(!isEditing); // Toggle edit mode
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
              <Link to={"/dashboard"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            {isAdmin && (
            <Button
                    variant="ghost"
                    onClick={handleEditToggle}
                    className="mt-4"
                  >
                    {isEditing ? "Save" : "Edit"}
            </Button>
            )}  
            {loading ? (
              <div className="h-16 w-full animate-pulse rounded-md bg-muted"></div>
            ) : line ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`rounded-lg p-4 mb-6 text-white ${getLineClass(line.category.name)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getLineIcon(line.category.name)}
                      <div>
                        {isEditing ? (
                            <input
                              type="text"
                              value={editableName}
                              onChange={(e) => setEditableName(e.target.value)}
                              className="text-3xl font-bold bg-transparent border-none outline-none"
                            />
                          ) : (
                            <p className="text-3xl font-bold bg-transparent border-none outline-none">{line.name}</p>
                          )}  
                        <p className="opacity-80">
                          {stops.length} arrêts • {distance ? `${distance} km` : "Distance inconnue"}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-white/25 hover:bg-white/30">
                      {line.category.name}
                    </Badge>
                  </div>
                  
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-destructive/10 text-destructive">
                <Info className="h-5 w-5" />
                <p>Ligne introuvable</p>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="h-64 animate-pulse rounded-xl bg-muted"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-64 animate-pulse rounded-xl bg-muted"></div>
              </div>
            </div>
          ) : line ? (
            <Tabs defaultValue="infos">
              <TabsList className="glass-panel mb-6">
                <TabsTrigger value="infos" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Informations
                </TabsTrigger>
                <TabsTrigger value="stops" className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Arrêts
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Carte
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <motion.div variants={itemVariants} className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        Horaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Début de service</div>
                            <div className="font-medium">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editableStart}
                                  onChange={(e) => setEditableStart(e.target.value)}
                                  className="bg-transparent border-b-2 outline-none"
                                />
                              ) : (
                                line.debut_activite
                              )}
                          </div>                       
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Fin de service</div>
                            <div className="font-medium">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editableEnd}
                                  onChange={(e) => setEditableEnd(e.target.value)}
                                  className="bg-transparent border-b-2 outline-none"
                                />
                              ) : (
                                line.fin_activite
                              )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-muted-foreground" />
                        Distance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <div className="text-sm text-muted-foreground">Longueur de la ligne</div>
                        <div className="font-medium">{distance ? `${distance} km` : "Non disponible"}</div>
                      </div>
                    </CardContent>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        Détails
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Date de création</div>
                          <div className="font-medium">{formatDate(line.creation)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Nombre d'arrêts</div>
                          <div className="font-medium">{stops.length}</div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="stops">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="glass-card p-6"
                >
                <h3 className="text-xl font-semibold mb-4">Liste des arrêts</h3>
                  {isAdmin && (
                      <div className="my-4">
                      <Button onClick={toggleForm} variant={showForm ? "destructive" : "default"}>
                        {showForm ? "Annuler" : "Ajouter un arrêt"}
                      </Button>

                      {showForm && (
                        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg shadow-lg max-w-md">
                          <label className="block mb-2 font-medium">Nom de l'arrêt</label>
                          <input
                            type="text"
                            value={newStopName}
                            onChange={(e) => setNewStopName(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Ex: Gare Centrale"
                            required
                          />
                          <label className="block mb-2 font-medium">Ordre de l'arret</label>
                          <input
                            type="number"
                            value={newOrder}
                            onChange={(e) => setNewOrder(Number(e.target.value))}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Ex: 1"
                            required
                          />
                          <label className="block mb-2 font-medium">Longitude</label>
                          <input
                            type="text"
                            value={newLong}
                            onChange={(e) => setNewLong(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Ex: 43°37'13.6"
                            required
                          />
                          <label className="block mb-2 font-medium">Latitude</label>
                          <input
                            type="text"
                            value={newLat}
                            onChange={(e) => setNewLat(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Ex: 1°26'09.2"
                            required
                          />
                          <Button type="submit">Valider</Button>
                        </form>
                      )}
                    </div>)
                    }
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-6 border-l-2 border-dashed border-muted-foreground/30"></div>
                    <ul className="space-y-6">
                      {stops.map((stop, index) => (
                        <motion.li
                          key={stop.id}
                          variants={itemVariants}
                          className="relative pl-12"
                        >
                          <div className="absolute left-[22px] -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-background border-2 border-primary z-10"></div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-background/50 p-3 rounded-lg">
                            <div>
                              <div className="font-medium">{stop.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {index === 0 ? "Départ" : index === stops.length - 1 ? "Terminus" : `Arrêt ${index + 1}`}
                              </div>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={() => deleteStop(stop.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                              >
                                X
                              </button>)
                            }
                            {/* <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                              {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                            </div> */}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="map">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <MapView stops={stops} className="h-[500px]" />
                </motion.div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-muted-foreground">
                <p>Ligne introuvable ou données indisponibles.</p>
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

export default LineDetail;
