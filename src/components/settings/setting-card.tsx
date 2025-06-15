import React from "react";

interface SettingCardProps {
  title: string;
  children: React.ReactNode;
}

export function SettingCard({ title, children }: SettingCardProps) {
  return (
    <div className="card bg-base-100 card-border mb-4 md:mb-0">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
