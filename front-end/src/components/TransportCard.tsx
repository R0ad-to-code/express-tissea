
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bus, Train, SquareM } from "lucide-react";
import { Link } from "react-router-dom";


type TransportCardProps = {
  id: string;
  name: string;
  type: string;
  categoryId: string;
  description?: string;
  stopsCount?: number;
  distance?: number;
  className?: string;
};

export const TransportCard = ({
  id,
  name,
  type,
  categoryId,
  description,
  stopsCount,
  distance,
  className = "",
}: TransportCardProps) => {
  const icons = {
    Bus: <Bus className="h-6 w-6" />,
    Tramway: <Train className="h-6 w-6" />,
    Métro: <SquareM className="h-6 w-6" />,
    default: <Bus className="h-6 w-6" />,
  };

  const gradientClass = {
    Bus: "transport-bus-gradient",
    Tramway: "transport-tram-gradient",
    Métro: "transport-metro-gradient",
    default: "transport-gradient",
  };

  return (
    <Link 
      to={`/categories/${categoryId}/lines/${id}`} 
      className="block transition-transform duration-300 hover:translate-y-[-4px]"
    >
      <Card className={`overflow-hidden h-full ${className}`}>
        <CardHeader className={`pb-2 ${gradientClass[type]} text-white`}>
          <div className="flex justify-between items-center">
            <div className="font-medium text-lg">{name}</div>
            <div>{icons[type]}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {stopsCount !== undefined && (
              <Badge variant="outline" className="flex items-center gap-1">
                <span>{stopsCount}</span>
                <span className="text-xs">arrêts</span>
              </Badge>
            )}
            
            {distance !== undefined && (
              <Badge variant="outline" className="flex items-center gap-1">
                <span>{distance}</span>
                <span className="text-xs">km</span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
