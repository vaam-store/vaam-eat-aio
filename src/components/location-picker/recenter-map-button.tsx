import React from "react";
import { MapPin } from "react-feather";
import { Button } from "../button";

interface RecenterMapButtonProps {
  onClick: () => void;
  className?: string;
}

export const RecenterMapButton: React.FC<RecenterMapButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <Button
      size="xl"
      type="button"
      onClick={onClick}
      variant="soft"
      shape="circle"
      className={className}
      aria-label="Recenter map"
    >
      <MapPin />
    </Button>
  );
};
