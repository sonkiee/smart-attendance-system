import * as Location from "expo-location";
import { Linking } from "react-native";

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

export const getCurrentLocation = async (): Promise<CurrentLocation> => {
  const enabled = await Location.hasServicesEnabledAsync();

  if (!enabled) {
    await Linking.openSettings();
    throw new Error("LOCATION_SERVICES_DISABLED");
  }

  const permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    if (!permission.canAskAgain) {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const requested = await Location.requestForegroundPermissionsAsync();

    if (requested.status !== Location.PermissionStatus.GRANTED) {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
  };
};
