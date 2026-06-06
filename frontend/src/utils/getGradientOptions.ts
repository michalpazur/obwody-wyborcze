import { candidatesConfig, ElectionId, electionsConfig } from "../config";
import { CandidatesKey } from "../redux/electionsSlice";
import { GRADIENT_COLORS } from "./createColorConfig";
import { GradientOptions } from "./generateFillColors";

export const getGradientOptions = (
  showTurnout: boolean,
  candidate: CandidatesKey,
  elections: ElectionId,
): Required<GradientOptions> => {
  const electionConfig = electionsConfig[elections];

  const {
    minGradient = 0,
    maxGradient = 100,
    numColors = GRADIENT_COLORS,
  } = electionConfig.gradientOptions ?? {};

  let gradientOptions: Required<GradientOptions> = {
    minGradient,
    maxGradient,
    numColors,
  };

  if (showTurnout) {
    gradientOptions = {
      ...gradientOptions,
      ...electionConfig.turnoutGradientOptions,
    };
  } else if (candidate !== "all") {
    const candidateOptions = candidatesConfig[candidate];
    const electionOverride =
      electionsConfig[elections].candidatesConfig?.[candidate];

    return {
      ...gradientOptions,
      ...candidateOptions,
      ...electionOverride,
    };
  }

  return gradientOptions;
};
