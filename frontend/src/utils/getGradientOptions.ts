import { candidatesConfig, ElectionId, electionsConfig } from "../config";
import { CandidatesKey } from "../redux/electionsSlice";
import { GradientOptions } from "./generateFillColors";

export const getGradientOptions = (
  candidate: CandidatesKey,
  elections: ElectionId,
) => {
  const electionConfig = electionsConfig[elections];
  let gradientOptions: GradientOptions = {};

  if (candidate === "all") {
    gradientOptions = {
      minGradient: electionConfig.minGradient,
      maxGradient: electionConfig.maxGradient,
      numColors: electionConfig.numColors,
    };
  } else {
    let { minGradient, maxGradient, numColors } = candidatesConfig[candidate];
    const override = electionsConfig[elections].candidatesConfig?.[candidate];

    if (override) {
      gradientOptions = override;
    } else {
      gradientOptions = { minGradient, maxGradient, numColors: numColors };
    }
  }

  return gradientOptions;
};
