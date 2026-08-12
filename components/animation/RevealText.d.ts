import { CSSProperties, ReactNode, FC, ElementType } from 'react';

export interface RevealTextProps {
  children: ReactNode;
  className?: string;
  type?: 'words' | 'chars';
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: string;
  animationOnScrool?: boolean;
  style?: CSSProperties;
  as?: ElementType;
}

declare const RevealText: FC<RevealTextProps>;
export default RevealText;
