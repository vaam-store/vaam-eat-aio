import React from "react";

interface VerificationEmailProps {
  verificationLink: string;
}

export const VerificationEmail = ({
  verificationLink,
}: VerificationEmailProps) => {
  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center p-4">
      <div className="card bg-base-100 border-base-300 w-96 border">
        <div className="card-body text-center">
          <h2 className="card-title text-primary justify-center">
            Verify your email address
          </h2>
          <p className="text-base-content mt-4">
            Please click the button below to verify your email address.
          </p>
          <div className="card-actions mt-6 justify-center">
            <a href={verificationLink} className="btn btn-primary">
              Verify Email
            </a>
          </div>
          <p className="text-base-content/70 mt-4 text-sm">
            This link will expire in 1 hour.
          </p>
        </div>
      </div>
    </div>
  );
};
