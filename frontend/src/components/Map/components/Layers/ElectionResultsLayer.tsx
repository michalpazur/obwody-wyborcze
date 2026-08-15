import { useMemo } from "react";
import { Layer } from "react-map-gl/maplibre";
import {
  electionsConfig,
  layerIds,
  mapOpacity,
  turnoutColorConfig,
} from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import {
  generateFillColors,
  getWinnerFillColors,
} from "../../../../utils/generateFillColors";
import { getCandidateConfig } from "../../../../utils/getCandidateConfig";
import { getGradientOptions } from "../../../../utils/getGradientOptions";
import { ElectionsDataSource } from "./ElectionDataSource";

const ElectionsResultsLayer: React.FC = () => {
  const { candidate, elections, showTurnout } = useElectionsStore();
  const electionConfig = electionsConfig[elections];
  const gradientOptions = getGradientOptions(showTurnout, candidate, elections);

  const fill = useMemo(() => {
    if (showTurnout) {
      return generateFillColors("turnout", turnoutColorConfig, gradientOptions);
    }

    if (candidate === "all") {
      return getWinnerFillColors(elections, gradientOptions);
    }

    return generateFillColors(
      `${candidate}_proc`,
      getCandidateConfig(candidate, elections),
      gradientOptions,
    );
  }, [gradientOptions]);

  return (
    <ElectionsDataSource>
      <Layer
        id="turnout"
        source={elections}
        source-layer={electionConfig.sourceLayer}
        beforeId={layerIds.water}
        type="fill"
        paint={{ "fill-color": fill, "fill-opacity": mapOpacity }}
      />
    </ElectionsDataSource>
  );
};

export default ElectionsResultsLayer;
