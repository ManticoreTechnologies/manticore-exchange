const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  price,
  quantity,
  pinataGateway,
  onQuantityChange,
  onAddToCart,
  onSelectAsset,
  isSelected
}) => {
  const available = Number(asset.confirmed_balance);

  return (
    <div 
      className={`asset-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelectAsset}
    >
      {/* ... rest of the component remains the same ... */}
    </div>
  );
}; 