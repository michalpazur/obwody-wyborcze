import { Box, Avatar as MuiAvatar, SxProps } from "@mui/material";
import React from "react";
import { Candidate } from "../../../../../config";
import { getInitials } from "../../../../../utils/getInitials";
import { useIsParliamentaryElection } from "../../../../../utils/useIsParliamentaryElection";

const avatarSx: SxProps = {
  fontSize: "12px",
  mr: 1,
  width: "24px",
  height: "24px",
};

const Avatar: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const isParliamentaryElection = useIsParliamentaryElection();

  return isParliamentaryElection && candidate.avatarUrl ? (
    <Box component="img" alt="" src={candidate.avatarUrl} sx={avatarSx} />
  ) : (
    <MuiAvatar src={candidate.avatarUrl} sx={avatarSx}>
      {candidate.short ?? getInitials(candidate.name)}
    </MuiAvatar>
  );
};

export default Avatar;
