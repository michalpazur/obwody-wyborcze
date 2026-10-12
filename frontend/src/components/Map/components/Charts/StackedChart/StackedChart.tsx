import { Box, Stack, SxProps, Theme, Tooltip } from "@mui/material";
import React from "react";
import { candidatesConfig, tieColorConfig } from "../../../../../config";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { serifFont } from "../../../../../theme";
import { Candidate, Results } from "../../../../../types";
import { getWinnerName } from "../../../../../utils/getLabels";
import Bar from "../components/Bar";
import BarBackground from "../components/BarBackground";
import BarLabel from "../components/BarLabel";
import { formatNumber } from "../utils/formatNumber";

const LegendDot: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const color = candidate.color || tieColorConfig.color;

  return (
    <Box
      sx={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
  );
};

const CandidateTooltip: React.FC<{ result: Results }> = ({ result }) => {
  const { elections } = useElectionsStore();
  const candidate = candidatesConfig[result.candidate];

  return (
    <Stack spacing={1}>
      <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
        <LegendDot candidate={candidate} />
        <BarLabel variant="light" sx={{ fontFamily: serifFont }}>
          {getWinnerName(result.candidate, elections)}
        </BarLabel>
      </Stack>
      {!result.withdrawn ? (
        <BarLabel variant="light">
          {result.resultProc}% ({formatNumber(result.result)})
        </BarLabel>
      ) : (
        <BarLabel variant="light">Kandydat skreślony</BarLabel>
      )}
    </Stack>
  );
};

const CandidateLegend: React.FC<{ result: Results }> = ({ result }) => {
  const { elections } = useElectionsStore();
  const candidate = candidatesConfig[result.candidate];

  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
      <LegendDot candidate={candidate} />
      <BarLabel sx={result.withdrawn ? { textDecoration: "line-through" } : {}}>
        {getWinnerName(result.candidate, elections)}
      </BarLabel>
    </Stack>
  );
};

const legendSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  columnGap: 2,
  rowGap: 1,
};

const StackedChart: React.FC<{ results: Results[] }> = ({ results }) => {
  return (
    <Stack spacing={1}>
      <BarBackground>
        {results.map((result) => {
          const candidate = candidatesConfig[result.candidate];
          const color = candidate.color || tieColorConfig.color;

          if (result.withdrawn) {
            return null;
          }

          return (
            <Tooltip
              title={<CandidateTooltip result={result} />}
              key={result.candidate}
            >
              <Bar value={result.resultProc} color={color} flex>
                {result.resultProc > 10 && (
                  <BarLabel backgroundColor={color}>
                    {result.resultProc}%
                  </BarLabel>
                )}
              </Bar>
            </Tooltip>
          );
        })}
      </BarBackground>
      <Box sx={legendSx}>
        {results.map((result) => (
          <CandidateLegend key={result.candidate} result={result} />
        ))}
      </Box>
    </Stack>
  );
};

export default StackedChart;
