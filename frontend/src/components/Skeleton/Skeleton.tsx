import {
  Skeleton as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
} from "@mui/material";
import React from "react";

type SkeletonProps = MuiSkeletonProps & { isLoading?: boolean };

const Skeleton: React.FC<SkeletonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  if (isLoading) {
    return <MuiSkeleton {...props}>{children}</MuiSkeleton>;
  }

  return children;
};

export default Skeleton;
