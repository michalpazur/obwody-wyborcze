import { Box, Avatar as MuiAvatar, SxProps } from "@mui/material";
import React from "react";
import { Candidate, electionsConfig } from "../../../../../config";
import { useElectionsStore } from "../../../../../redux/electionsSlice";
import { getInitials } from "../../../../../utils/getInitials";

const avatarSx: SxProps = {
  fontSize: "12px",
  mr: 1,
  width: "24px",
  height: "24px",
};

const Avatar: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const { elections } = useElectionsStore();

  return electionsConfig[elections].type === "parliament" &&
    candidate.avatarUrl ? (
    <Box component="img" alt="" src={candidate.avatarUrl} sx={avatarSx} />
  ) : (
    <MuiAvatar src={candidate.avatarUrl} sx={avatarSx}>
      {candidate.short ?? getInitials(candidate.name)}
    </MuiAvatar>
  );
};

export default Avatar;
