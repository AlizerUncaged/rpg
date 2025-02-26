import React from 'react';

const Button = ({
     onClick,
     children,
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
          small: "text-xs py-1 px-2",
          medium: "text-sm py-2 px-4",
          large: "text-base py-3 px-6",
     };

     const disabledStyles = disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer";

     // Glitch effect styles
     const glitchEffect = "relative after:content-[attr(data-text)] after:absolute after:left-[2px] after:text-[#00FFFF] after:bg-[#0A0A23] after:overflow-hidden after:clip-path after:animate-glitch-1 before:content-[attr(data-text)] before:absolute before:left-[-2px] before:text-[#FF7700] before:bg-[#0A0A23] before:overflow-hidden before:clip-path before:animate-glitch-2";

     return (
          <button
               onClick={onClick}
               disabled={disabled}
               data-text={children}
               className={`
        ${baseStyles}
        ${typeStyles[type]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
        hover:shadow-[0_0_10px_rgba(57,255,20,0.7)]
      `}
          >
               {children}
          </button>
     );
};

export default Button;