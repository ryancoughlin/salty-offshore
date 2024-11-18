interface RegionImageProps {
  thumbnail?: string;
  name: string;
}

export const RegionImage = ({ thumbnail, name }: RegionImageProps) => {
  if (!thumbnail) return null;
  
  return (
    <div className="w-20 h-12 relative overflow-hidden rounded-lg bg-white/10">
      <img
        src={`http://157.245.10.94/${thumbnail}`}
        alt={`${name} region`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}; 