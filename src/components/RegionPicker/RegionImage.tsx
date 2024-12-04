interface RegionImageProps {
  thumbnail?: string;
  name: string;
}

export const RegionImage = ({ thumbnail, name }: RegionImageProps) => {
  if (!thumbnail) return null;

  return (
    <div className="w-16 h-10 relative overflow-hidden rounded">
      <img
        src={`http://157.245.10.94/${thumbnail}`}
        alt={`${name} region`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}; 