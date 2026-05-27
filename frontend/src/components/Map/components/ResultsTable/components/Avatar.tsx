import { Box, Avatar as MuiAvatar, SxProps } from "@mui/material";
import React from "react";
import { Candidate } from "../../../../../config";
import { getInitials } from "../../../../../utils/getInitials";
import { useElectionConfig } from "../../../../../utils/useElectionConfig";
import NoIcon from '@mui/icons-material/NotInterestedRounded';
import YesIcon from '@mui/icons-material/TaskAltRounded';
import { mergeSx } from "../../../../../utils/mergeSx";

const avatarSx: SxProps = {
  fontSize: "12px",
  mr: 1,
  width: "24px",
  height: "24px",
};

const Avatar: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const electionConfig = useElectionConfig();

  if (electionConfig.type === "parliament" && candidate.avatarUrl) {
    return (
      <Box component="img" alt="" src={candidate.avatarUrl} sx={avatarSx} />
    );
  }

  if (electionConfig.type === "referendum") {
    const answer = candidate.candidateId;
    switch (answer) {
      case "yes":
        return <YesIcon sx={mergeSx(avatarSx, { color: candidate.color })} />;
      case "no":
        return <NoIcon sx={mergeSx(avatarSx, { color: candidate.color })} />;
      default:
        return null;
    }
  }

  return (
    <MuiAvatar src={candidate.avatarUrl} sx={avatarSx}>
      {candidate.short ?? getInitials(candidate.name)}
    </MuiAvatar>
  );
};

export default Avatar;
