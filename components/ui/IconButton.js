// components/ui/IconButton.js
import React from 'react';

const IconButton = ({
     onClick,
     children,
     icon, // Icon name or component
     type = 'primary',
     disabled = false,
     className = '',
     size = 'medium'
}) => {
     const baseStyles = "font-['Press_Start_2P'] transition-all duration-200 flex items-center justify-center";

     const typeStyles = {
          primary: "bg-[#00FFFF] hover:bg-[#00CCCC] text-[#0A0A23] border-2 border-[#39FF14]",
          secondary: "bg-[#9D00FF] hover:bg-[#7A00CC] text-white border-2 border-[#39FF14]",
          accent: "bg-[#FF7700] hover:bg-[#CC5F00] text-white border-2 border-[#39FF14]",
          danger: "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400",
     };

     const sizeStyles = {
          small: "text-xs p-1",
          medium: "text-sm p-2",
          large: "text-base p-3",
     };

     const disabledStyles = disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer";

     return (
          <button
               onClick={onClick}
               disabled={disabled}
               className={`
        ${baseStyles}
        ${typeStyles[type]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
        rounded-md
        hover:shadow-[0_0_10px_rgba(57,255,20,0.7)]
      `}
          >
               {icon && <span className="mr-2">{icon}</span>}
               {children}
          </button>
     );
};

export default IconButton;