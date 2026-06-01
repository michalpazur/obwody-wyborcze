import { createContext } from "react";
import { ElectionId } from "../types";

export type MapContextType = {
  availableElections: ElectionId[];
};

export const MapContext = createContext<MapContextType>({
  availableElections: [],
});
