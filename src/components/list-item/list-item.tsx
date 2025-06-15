import React from "react";
import Link from "next/link";
import { Text } from "../text";

interface ListItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  icon,
  endIcon,
  href,
  onClick,
}) => {
  const commonProps = {
    className: "list-row items-center",
    onClick: onClick,
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {icon}
        <div className="flex-grow">
          <Text className="font-bold">{title}</Text>
          {description && (
            <Text className="text-opacity-70 text-sm">{description}</Text>
          )}
        </div>
        {endIcon}
      </Link>
    );
  }

  return (
    <button type="button" {...commonProps}>
      {icon}
      <div className="flex-grow">
        <Text className="font-bold">{title}</Text>
        {description && (
          <Text className="text-opacity-70 text-sm">{description}</Text>
        )}
      </div>
      {endIcon}
    </button>
  );
};
