"use client";

import React from "react";

// Curve divider helper functions

export type CurveStyle = 'gentle' | 'wave' | 'smooth';

export const curvePaths: Record<CurveStyle, string> = {
  gentle: "M500,97C126.7,96.3,0.8,19.8,0,0v100l1000,0V1C1000,19.4,873.3,97.8,500,97z", // Original gentle curve
  wave: "M0,0c100,0,200,60,300,60c100,0,200-60,300-60c100,0,200,60,300,60c100,0,100-60,100-60v100H0V0z", // Wavy pattern
  smooth: "M0,0c200,0,300,40,500,40c200,0,300-40,500-40v100H0V0z" // Smooth rounded curve
};

export interface CurveDividerProps {
  showTopCurve?: boolean;
  showBottomCurve?: boolean;
  topCurveColor?: string;
  bottomCurveColor?: string;
  topCurveStyle?: CurveStyle;
  bottomCurveStyle?: CurveStyle;
}

export const renderTopCurve = (props: CurveDividerProps): React.ReactElement | null => {
  if (props.showTopCurve === false) return null;
  
  // -1px nudge covers sub-pixel seams between stacked sections on mobile
  return (
    <div
      data-invite-shell="curve"
      className="pointer-events-none absolute -top-px right-0 left-0 z-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-16 w-full" style={{ fill: props.topCurveColor || '#ffffff', transform: 'rotate(180deg)' }}>
        <path d={curvePaths[props.topCurveStyle || 'gentle']} />
      </svg>
    </div>
  );
};

export const renderBottomCurve = (props: CurveDividerProps): React.ReactElement | null => {
  if (props.showBottomCurve === false) return null;
  
  // -1px nudge covers sub-pixel seams between stacked sections on mobile
  return (
    <div
      data-invite-shell="curve"
      className="pointer-events-none absolute right-0 -bottom-px left-0 z-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-16 w-full" style={{ fill: props.bottomCurveColor || '#ffffff' }}>
        <path d={curvePaths[props.bottomCurveStyle || 'gentle']} />
      </svg>
    </div>
  );
};

