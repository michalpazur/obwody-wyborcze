import React, { useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useLocalElectionConfig } from "../../../../utils/useLocalElectionConfig";

const BoundsController: React.FC = () => {
  const map = useMap();
  const initialRender = useRef(true);
  const localElectionsConfig = useLocalElectionConfig();

  useEffect(() => {
    if (!map.current || !localElectionsConfig) {
      initialRender.current = false;
      return;
    }

    const { bounds, center } = localElectionsConfig.bounds;
    const camera = map.current.cameraForBounds(bounds, {
      padding: { top: 72, right: 12, left: 12, bottom: 12 },
    });

    const cameraZoom = camera?.zoom ?? 0;
    const zoomToCenter = cameraZoom < 10;

    map.current.flyTo({
      center: zoomToCenter ? center : camera?.center,
      zoom: zoomToCenter ? 12 : cameraZoom,
      duration: 1500,
      minZoom: 9,
      animate: !initialRender.current,
    });

    initialRender.current = false;
  }, [localElectionsConfig]);

  return null;
};

export default BoundsController;
