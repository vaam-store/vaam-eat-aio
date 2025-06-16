import React from "react";
import { CheckSquare } from "react-feather";
import { Text } from "@app/components/text";
import { twMerge } from "tailwind-merge";

interface VendorStepperProps {
  currentStep: number;
  formSteps: { title: string; validationSchema: any }[];
}

export function VendorStepper({ currentStep, formSteps }: VendorStepperProps) {
  return (
    <ul className={twMerge("steps steps-horizontal md:steps-vertical w-full")}>
      {formSteps.map((step, index) => (
        <li
          key={step.title}
          className={twMerge("step", index <= currentStep && "step-primary")}
        >
          <span className="step-icon">
            <CheckSquare
              size={20}
              className={twMerge(
                index <= currentStep && "text-primary-content",
                index > currentStep && "text-base-content opacity-50",
              )}
            />
          </span>
          <Text
            bold={index === currentStep}
            className={twMerge("hidden text-lg md:block")}
          >
            {step.title}
          </Text>
        </li>
      ))}
    </ul>
  );
}
