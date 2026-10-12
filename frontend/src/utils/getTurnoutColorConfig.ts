import { ElectionId, electionsConfig, turnoutColorConfig } from "../config";

export const getTurnoutColorConfig = (elections: ElectionId) => {
  const electionConfig = electionsConfig[elections];
  const override = electionConfig.turnoutConfig;

  return {
    ...turnoutColorConfig,
    ...override,
  };
};
