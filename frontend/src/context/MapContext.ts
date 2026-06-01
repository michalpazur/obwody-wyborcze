import { createContext } from "react";
import { ElectionId } from "../types";

export type MapContextType = {
  availableElections: ElectionId[];
  localElections: boolean;
};

export const MapContext = createContext<MapContextType>({
  availableElections: [],
  localElections: false,
});
