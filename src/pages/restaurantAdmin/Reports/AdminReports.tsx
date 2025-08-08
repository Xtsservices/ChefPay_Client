import React from "react";

interface ReportsProps {
  imageUrl?: string;
  altText?: string;
  overlayText?: string;
  className?: string;
}

export const AdminReports: React.FC<ReportsProps> = ({
  imageUrl = "https://img.freepik.com/free-vector/abstract-grunge-style-coming-soon-with-black-splatter_1017-26690.jpg",
  altText = "Coming Soon",
  overlayText,
  className = ""
}) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <img src={imageUrl} alt={altText} className="max-w-full h-auto" />
    {overlayText && (
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-white text-3xl font-bold drop-shadow-lg">{overlayText}</h2>
      </div>
    )}
  </div>
);
