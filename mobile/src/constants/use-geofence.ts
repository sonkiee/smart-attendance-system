import { getCurrentLocation } from "@/service/location";
import { getDistanceInMeters } from "@/utils/geo";
import { useState } from "react";

export const useGeofence = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<Error | null>(null);

  const verifyLocation = async (venue: {
    latitude: number;
    longitude: number;
    radius: number;
  }) => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const currentLocation = await getCurrentLocation();

      const { latitude, longitude } = currentLocation;

      const result = getDistanceInMeters(
        latitude,
        longitude,
        venue.latitude,
        venue.longitude,
      );

      return {
        isWithinGeofence: result <= venue.radius,
        distanceMeters: result,
        location: currentLocation,
      };
    } catch (error) {
      const locationError =
        error instanceof Error ? error : new Error("LOCATION_ERROR");

      setLocationError(locationError);

      throw locationError;
    } finally {
      setIsLocating(false);
    }
  };

  const resetLocation = () => {
    setIsLocating(false);
    setLocationError(null);
  };

  return {
    isLocating,
    locationError,
    verifyLocation,
    resetLocation,
  };
};
