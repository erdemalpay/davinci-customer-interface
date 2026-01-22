import { createContext, ReactNode, useContext, useState } from "react";

interface LocationContextType {
  selectedLocationId: number;
  setSelectedLocationId: (id: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocationId, setSelectedLocationId] = useState<number>(1);

  return (
    <LocationContext.Provider
      value={{ selectedLocationId, setSelectedLocationId }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error(
      "useLocationContext must be used within a LocationProvider"
    );
  }
  return context;
}
