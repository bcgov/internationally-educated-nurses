interface OfferBannerProps {
  className?: string;
}
export const OfferAcceptedBanner: React.FC<OfferBannerProps> = ({ children, className }) => {
  const defaultStyle = `flex items-center h-14 mb-5 font-bold rounded`;

  return <div className={`${defaultStyle} ${className}`}>{children}</div>;
};
