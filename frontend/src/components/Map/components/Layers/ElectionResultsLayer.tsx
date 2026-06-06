import { ExpressionSpecification } from "maplibre-gl";
import { useMemo } from "react";
import { Layer } from "react-map-gl/maplibre";
import {
  CandidateId,
  electionsConfig,
  layerIds,
  mapOpacity,
  tieColorConfig,
  turnoutColorConfig,
} from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import {
  generateFillColors,
  GradientOptions,
} from "../../../../utils/generateFillColors";
import { getCandidateConfig } from "../../../../utils/getCandidateConfig";
import { getGradientOptions } from "../../../../utils/getGradientOptions";
import { ElectionsDataSource } from "./ElectionDataSource";
import { colors } from "../../../../colors";

const SingleCandidateResultLayer: React.FC<{
  candidate: CandidateId;
  gradientOptions: GradientOptions;
  filterWinner?: boolean;
}> = ({ candidate, gradientOptions, filterWinner }) => {
  const { elections } = useElectionsStore();
  const electionConfig = electionsConfig[elections];

  const fill = useMemo(
    () =>
      generateFillColors(
        `${candidate}_proc`,
        getCandidateConfig(candidate, elections),
        gradientOptions,
      ),
    [candidate, elections],
  );

  return (
    <Layer
      {...(filterWinner ? { filter: ["==", "winner", candidate] } : undefined)}
      id={candidate}
      source={elections}
      source-layer={electionConfig.sourceLayer}
      beforeId={layerIds.water}
      type="fill"
      paint={{
        "fill-color": fill,
        "fill-opacity": mapOpacity,
      }}
    />
  );
};

const ElectionsResultsLayer: React.FC = () => {
  const { candidate, elections, showTurnout } = useElectionsStore();
  const electionConfig = electionsConfig[elections];
  const gradientOptions = getGradientOptions(showTurnout, candidate, elections);

  const layers = useMemo(() => {
    if (showTurnout) {
      const fill = generateFillColors(
        "turnout",
        turnoutColorConfig,
        gradientOptions,
      );

      return (
        <Layer
          id="turnout"
          source={elections}
          source-layer={electionConfig.sourceLayer}
          beforeId={layerIds.water}
          type="fill"
          paint={{ "fill-color": fill, "fill-opacity": mapOpacity }}
        />
      );
    }

    if (candidate !== "all") {
      return (
        <SingleCandidateResultLayer
          key={candidate}
          candidate={candidate}
          gradientOptions={gradientOptions}
        />
      );
    }

    return electionConfig.winners.map((candidate) => (
      <SingleCandidateResultLayer
        key={candidate}
        candidate={candidate}
        gradientOptions={gradientOptions}
        filterWinner
      />
    ));
  }, [elections, candidate, showTurnout]);

  const tieLayer = useMemo(() => {
    return (
      <Layer
        filter={[
          "all",
          ...electionConfig.winners.map(
            (winner) => ["!=", "winner", winner] as ExpressionSpecification,
          ),
        ]}
        id="tie"
        beforeId={layerIds.water}
        type="fill"
        source-layer={electionConfig.sourceLayer}
        paint={{
          "fill-color": generateFillColors(
            "winner_proc",
            { baseColor: tieColorConfig.baseColor },
            gradientOptions,
          ),
          "fill-opacity": mapOpacity,
        }}
      />
    );
  }, [elections]);

  return (
    <ElectionsDataSource>
      {layers}
      {!showTurnout && candidate === "all" && tieLayer}
    </ElectionsDataSource>
  );
};

export default ElectionsResultsLayer;
