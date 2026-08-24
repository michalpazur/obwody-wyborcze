import { Map, MapSourceDataEvent } from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { useLiveElectionResults } from "../../../../services/useLiveElectionResults";
import { ElectionId, LiveDistrictInfo, LiveResults } from "../../../../types";
import { FeatureSelector } from "../../../../types/map";
import { useFeatureSelector } from "../../../../utils/useFeatureSelector";

// Results are supposed to be final (so a check by counted should be enough) but with PKW, who knows!
const hasChanged = (prev: LiveDistrictInfo, current: LiveDistrictInfo) => {
  return (
    prev.counted !== current.counted ||
    prev.all_votes !== current.all_votes ||
    prev.total !== current.total
  );
};

const applyResultsToFeatures = (
  map: Map,
  results: LiveResults,
  previousResults: LiveResults | null,
  featureSelector: FeatureSelector,
) => {
  results.byDistrict.forEach((districtInfo, id) => {
    const prev = previousResults?.byDistrict.get(id);
    if (prev && !hasChanged(prev, districtInfo)) {
      return;
    }

    const { district, ...state } = districtInfo;
    map.setFeatureState({ ...featureSelector, id }, state);
  });
};

const LiveElectionsState: React.FC = () => {
  const map = useMap();
  const { elections } = useElectionsStore();
  const { data: results } = useLiveElectionResults();
  const selector = useFeatureSelector();
  const previous = useRef<{ elections: ElectionId; results: LiveResults }>(
    null,
  );

  useEffect(() => {
    previous.current = null;
  }, [elections]);

  useEffect(() => {
    const mapInstance = map.current?.getMap();
    if (!mapInstance || !results) {
      return;
    }

    const applyResults = () => {
      const source = mapInstance.getSource(elections);
      if (!source?.loaded()) {
        return false;
      }

      const previousResults =
        previous.current?.elections === elections
          ? previous.current.results
          : null;

      // If results didn't change useLiveElectionResults returns a reference
      // to the old object, so there's no need to update the results
      if (results === previousResults) {
        return true;
      }

      applyResultsToFeatures(mapInstance, results, previousResults, selector);
      previous.current = { elections, results };
      return true;
    };

    if (applyResults()) {
      // Results were applied, no need to wait for the source layer to load
      return;
    }

    const onSourceData = (e: MapSourceDataEvent) => {
      if (e.sourceId === elections && applyResults()) {
        mapInstance.off("sourcedata", onSourceData);
      }
    };

    mapInstance.on("sourcedata", onSourceData);
    return () => {
      mapInstance.off("sourcedata", onSourceData);
    };
  }, [map, selector, results]);

  return null;
};

export default LiveElectionsState;
