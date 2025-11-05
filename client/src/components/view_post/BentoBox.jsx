import React from "react";

/**
 * A reusable wrapper component for bento grid items.
 * Provides consistent styling, borders, and hover effects.
 *
 * @param {object} props
 * @param {string} props.className - Additional Tailwind classes for grid spanning (e.g., "lg:col-span-2").
 * @param {React.ReactNode} props.children - The content to display inside the box.
 */
const BentoBox = ({ className = "", children }) => {
  return (
    <div
      className={`
        bg-zinc-900 border border-zinc-800 rounded-2xl p-6 
        shadow-lg transition-all duration-300 ease-in-out
        hover:border-lime-300/50 hover:shadow-lime-300/10 hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default BentoBox;