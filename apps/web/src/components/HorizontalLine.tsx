export interface HorizontalLineProps {
  className?: string;
}

export const HorizontalLine = ({ className }: HorizontalLineProps) => {
  return <hr className={`border-bcGray border w-full ${className}`} />;
};
