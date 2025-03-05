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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        if (!mapRef.current || stops.length === 0) return;

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          setError("Clé API Google Maps manquante.");
          return;
        }

        // Charger le script Google Maps si non présent
        if (!window.google?.maps) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.onload = () => initMap();
          document.body.appendChild(script);
          return;
        }

        // Définir le centre sur le premier stop
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: {
            lat: Number(stops[0].latitude),
            lng: Number(stops[0].longitude),
          },
          zoom: 12,
        });

        // Ajouter les marqueurs
        stops.forEach((stop) => {
          new google.maps.Marker({
            position: { lat: Number(stop.latitude), lng: Number(stop.longitude) },
            map: mapInstance,
            title: stop.name,
          });
        });

        setMap(mapInstance);
      } catch (err) {
        console.error("Erreur lors du chargement de la carte", err);
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

  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div ref={mapRef} className="w-full h-[500px] rounded-lg bg-muted/30" />
    </Card>
  );
};
