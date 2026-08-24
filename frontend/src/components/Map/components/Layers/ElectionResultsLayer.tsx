import { ExpressionSpecification } from "maplibre-gl";
import { useMemo } from "react";
import { Layer } from "react-map-gl/maplibre";
import {
  electionsConfig,
  layerIds,
  mapOpacity,
  notCountedColor,
  turnoutColorConfig,
} from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import {
  generateFillColors,
  getWinnerFillColors,
} from "../../../../utils/generateFillColors";
import { getCandidateConfig } from "../../../../utils/getCandidateConfig";
import { getGradientOptions } from "../../../../utils/getGradientOptions";
import { useIsLive } from "../../../../utils/useIsLive";
import { ElectionsDataSource } from "./ElectionDataSource";

const isCounted: ExpressionSpecification = [
  "to-boolean",
  ["feature-state", "counted"],
];

const ElectionsResultsLayer: React.FC = () => {
  const { candidate, elections, showTurnout } = useElectionsStore();
  const electionConfig = electionsConfig[elections];
  const gradientOptions = getGradientOptions(showTurnout, candidate, elections);
  const isLive = useIsLive();

  const fillExpression = useMemo(() => {
    if (showTurnout) {
      return generateFillColors(
        "turnout",
        isLive,
        turnoutColorConfig,
        gradientOptions,
      );
    }

    if (candidate === "all") {
      return getWinnerFillColors(elections, isLive, gradientOptions);
    }

    return generateFillColors(
      `${candidate}_proc`,
      isLive,
      getCandidateConfig(candidate, elections),
      gradientOptions,
    );
  }, [gradientOptions, isLive]);

  const fill = useMemo(() => {
    if (!isLive) {
      return fillExpression;
    }

    return [
      "case",
      isCounted,
      fillExpression,
      notCountedColor,
    ] as ExpressionSpecification;
  }, [fillExpression, isLive]);

  return (
    <ElectionsDataSource>
      <Layer
        id={layerIds.elections}
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
