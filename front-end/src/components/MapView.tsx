
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

type Stop = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
};

type MapViewProps = {
  stops: Stop[];
  className?: string;
};

export const MapView = ({ stops, className = "" }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cette fonction sera implémentée pour intégrer une carte
    // Utilise les coordonnées des arrêts pour créer des marqueurs sur la carte
    const initMap = async () => {
      try {
        if (!mapRef.current || stops.length === 0) return;
        
        // Simulation de chargement d'une carte
        // Dans une implémentation réelle, vous utiliserez Leaflet, MapboxGL, Google Maps, etc.
        setTimeout(() => {
          setMapLoaded(true);
        }, 1000);
        
      } catch (err) {
        console.error("Failed to initialize map", err);
        setError("Impossible de charger la carte. Veuillez réessayer plus tard.");
      }
    };

    initMap();
  }, [stops]);

  if (error) {
    return (
      <Card className={`p-4 flex items-center justify-center ${className}`}>
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  if (!mapLoaded) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg bg-muted/30">
        {/* Affichage sommaire de la carte en attendant l'intégration d'une vraie bibliothèque de cartes */}
        <div className="absolute inset-0 p-4 flex flex-col">
          <div className="text-sm font-medium mb-2">Points sur la carte :</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stops.map((stop) => (
              <div 
                key={stop.id} 
                className="bg-white/80 backdrop-blur-xs p-2 rounded text-xs flex items-center"
              >
                <div className="w-4 h-4 rounded-full bg-primary/80 mr-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium">{stop.name}</div>
                  <div className="text-muted-foreground">
                    {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
