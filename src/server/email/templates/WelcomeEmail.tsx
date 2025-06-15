import React from "react";

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => {
  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center p-4">
      <div className="card bg-base-100 border-base-300 w-96 border">
        <div className="card-body text-center">
          <h2 className="card-title text-primary justify-center">
            Welcome to Vaam Eat!
          </h2>
          <p className="text-base-content">Hello {userName},</p>
          <p className="text-base-content">
            Thank you for joining our community. We&#39;re excited to have you
            on board!
          </p>
          <div className="card-actions mt-4 justify-center">
            <a href="#" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
