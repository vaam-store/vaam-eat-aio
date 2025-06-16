import React from "react";
import { ErrorMessage } from "formik";

interface ErrorDisplayProps {
  name: string;
}

export function ErrorDisplay({ name }: ErrorDisplayProps) {
  return (
    <ErrorMessage
      name={name}
      component="div"
      className="text-error mt-1 text-xs"
    />
  );
}
