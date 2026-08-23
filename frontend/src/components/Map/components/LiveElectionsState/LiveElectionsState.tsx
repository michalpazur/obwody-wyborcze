import { Map } from "maplibre-gl";
import React, { useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { useLiveElectionResults } from "../../../../services/useLiveElectionResults";
import { ElectionId, LiveResults } from "../../../../types";
import { FeatureSelector } from "../../../../types/map";
import { useFeatureSelector } from "../../../../utils/useFeatureSelector";

const applyResultsToFeatures = (
  map: Map,
  results: LiveResults,
  previousResults: LiveResults | null,
  featureSelector: FeatureSelector,
) => {
  results.byDistrict.forEach((districtInfo, id) => {
    const prev = previousResults?.byDistrict.get(id);
    if (prev?.counted === districtInfo.counted) {
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
    const mapInstance = map.current?.getMap();
    if (!mapInstance || !results) {
      return;
    }

    const applyResults = () => {
      const source = mapInstance.getSource(elections);
      console.log("applyResults", source, results, selector);
      if (!source) {
        return false;
      }

      const previousResults =
        previous.current?.elections === elections
          ? previous.current.results
          : null;
      applyResultsToFeatures(mapInstance, results, previousResults, selector);
      previous.current = { elections, results };
      return true;
    };

    if (applyResults()) {
      // Results were applied, no need to wait for the source layer to load
      return;
    }

    const onSourceData = () => {
      // onSourceData is called on every tile load, we only need to *successfully* apply results once
      if (applyResults()) {
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
