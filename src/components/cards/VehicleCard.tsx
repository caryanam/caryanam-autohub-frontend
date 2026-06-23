import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Fuel, Gauge, Settings2, MapPin, Star, Heart, Sparkles } from "lucide-react";
import type { Vehicle } from "@/types";
import { formatINR, formatKM } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/public/useWishlist";
import { toast } from "sonner";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlistRequireLogin?: () => void;
  isLoggedIn?: boolean;
}

export function VehicleCard({
  vehicle,
  onWishlistRequireLogin,
  isLoggedIn,
}: VehicleCardProps) {
  const imageUrl =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0]
      : FALLBACK_IMG;
  const { wishlistIds, toggleWishlist: apiToggleWishlist } = useWishlist();
  const wishlisted = wishlistIds.includes(vehicle.id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn && onWishlistRequireLogin) {
      onWishlistRequireLogin();
      return;
    }
    try {
      const msg = await apiToggleWishlist(vehicle.id);
      if (msg) {
        toast.success(msg);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update wishlist");
    }
  };

  const isPremium = vehicle.vehicleType === "PREMIUM";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-card text-foreground shadow-card hover:shadow-premium border border-border/50 transition-shadow"
    >
      <Link to={`/car/${vehicle.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur text-foreground hover:text-foreground hover:bg-background/90 font-semibold"
            >
              {vehicle.registrationYear}
            </Badge>
          </div>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {vehicle.vehicleStatus === "FEATURED" && (
              <Badge className="gradient-primary text-white border-0 text-xs shadow-md">
                <Star className="h-3 w-3 fill-current mr-1" /> Featured
              </Badge>
            )}
          </div>

          {/* Wishlist heart */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow transition-transform hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${wishlisted ? "fill-rose-500 text-rose-500" : "text-foreground/60"}`}
            />
          </button>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Title + Price on same line */}
        <div>
          <Link to={`/car/${vehicle.id}`} className="block">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-bold text-md leading-tight truncate flex-1 hover:text-accent transition-colors flex items-center gap-1">
                {vehicle.registrationYear} {vehicle.brand} {vehicle.model}

              </h3>
              <span className="shrink-0 font-black text-md font-display text-foreground">
                {formatINR(vehicle.askingPrice)}
              </span>
            </div>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {vehicle.variant} {vehicle.fuelType} {isPremium && (
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0 inline-block animate-pulse" />
            )}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground border-y border-border py-3">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" />
            <span className="truncate">
              {formatKM(vehicle.kilometerDriven)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5" />
            <span className="truncate">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            <span className="truncate">{vehicle.transmission}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{vehicle.city}</span>
          </div>
          {vehicle.dealerContactName && (
            <span className="text-muted-foreground truncate ml-2">
              {vehicle.dealerContactName}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            asChild
            size="sm"
            className="flex-1 gradient-primary text-white border-0 hover:opacity-90"
          >
            <Link to={`/car/${vehicle.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card shadow-card overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
      </div>
    </div>
  );
}
