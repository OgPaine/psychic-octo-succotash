import React, { useState, useEffect, useCallback } from 'react';
import PadIcon from "../assets/pad.svg"; // Importing the SVG


const Terminal = () => {



  
  return (
<div className="flex items-center justify-center h-screen bg-[#04131C]">
   <div className="bg-[#082030] w-[500px] p-0 pb-0 rounded text-center relative box-border">
   <div className="flex items-center justify-center text-center mx-auto my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7 mr-2" />{" "}
          {/* Display the SVG here */}
          <h1
            className="text-[#14c7bb] text-lg mr-2"
            style={{
              textShadow: "0 0 5px #14c7bb, 0 0 20px #14c7bb, 0 0 30px #14c7bb",
            }}
          >
            Terminal
          </h1>
          <p className="text-white text-xs self-center">
          Replicate the sequence
          </p>
        </div>
       
        
        
</div>
</div>

  );
  
};

export default Terminal;