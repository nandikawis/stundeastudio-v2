"use client";

import React from "react";

export type FlowerStyle = 'red' | 'beage' | 'pink' | 'white';

export interface DecorativeFlowersProps {
  decorativeFlowers?: boolean;
  flowerStyle?: FlowerStyle;
  showTopCurve?: boolean;
  showBottomCurve?: boolean;
}

export const renderDecorativeFlowers = (props: DecorativeFlowersProps): React.ReactElement | null => {
  if (!props.decorativeFlowers) return null;

  // Calculate margin adjustments when dividers are active
  const topMargin = props.showTopCurve !== false ? '3rem' : '0'; // Move down when top divider is active
  const bottomMargin = props.showBottomCurve !== false ? '3rem' : '0'; // Move up when bottom divider is active

  return (
    <>
      {/* Top-left decorative flowers */}
      <div 
        className="absolute left-0 w-48 h-48 opacity-60 pointer-events-none z-[5]"
        style={{ top: 0, marginTop: topMargin }}
      >
        <img 
          src={`/decorative/${props.flowerStyle || 'beage'}_top_left.png`}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Bottom-right decorative flowers */}
      <div 
        className="absolute right-0 w-48 h-48 opacity-50 pointer-events-none z-[5]"
        style={{ bottom: 0, marginBottom: bottomMargin }}
      >
        <img 
          src={`/decorative/${props.flowerStyle || 'beage'}_bottom_right.png`}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
    </>
  );
};

// Helper to calculate margin when both divider and flowers are active
// This adds space around content without reducing section size
export const getFlowerMargin = (props: DecorativeFlowersProps): { marginTop?: string; marginBottom?: string } => {
  const margin: { marginTop?: string; marginBottom?: string } = {};
  
  if (props.decorativeFlowers) {
    // Add margin-top if top curve is active (to prevent overlap with top flowers)
    if (props.showTopCurve !== false) {
      margin.marginTop = '3rem'; // 48px (w-48)
    }
    // Add margin-bottom if bottom curve is active (to prevent overlap with bottom flowers)
    if (props.showBottomCurve !== false) {
      margin.marginBottom = '3rem'; // 48px (w-48)
    }
  }
  
  return margin;
};

