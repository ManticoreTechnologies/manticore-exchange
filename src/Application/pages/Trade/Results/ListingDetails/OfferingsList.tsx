import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatEvrAmount } from '@/utils/formatting';

interface Offering {
  id: string;
  asset_name: string;
  ipfs_hash: string;
  price: string;
  quantity: number;
  visible: boolean;
}

interface OfferingsListProps {
  offerings: Offering[];
  handleAddToCart: (offeringId: string, quantity: number) => void;
  quantity: number;
}

const OfferingsList: React.FC<OfferingsListProps> = ({ offerings, handleAddToCart, quantity }) => {
  const { t } = useTranslation();

  return (
    <section className="offerings-section">
      <h3>{t('offerings')}</h3>
      {offerings.length > 0 ? (
        offerings.map((offering, index) => (
          <div key={offering.id} className="offering-item">
            <h4>{t('offering')} {index + 1}</h4>
            <img
              src={`https://ipfs.manticore.exchange/ipfs/${offering.ipfs_hash}`}
              alt={offering.asset_name}
              className="offering-image"
              onError={(e) => e.currentTarget.src = '/path/to/enhanced_logo.png'}
            />
            <p>{t('assetName')}: {offering.asset_name}</p>
            <p>{t('price')}: {formatEvrAmount(offering.price)} EVR</p>
            <p>{t('quantity')}: {offering.quantity}</p>
            <p>{t('visible')}: {offering.visible ? t('yes') : t('no')}</p>
            <button onClick={() => handleAddToCart(offering.id, quantity)} className="add-to-cart-button">
              {t('addToCart')}
            </button>
          </div>
        ))
      ) : (
        <p>{t('noOfferingsAvailable')}</p>
      )}
    </section>
  );
};

export default OfferingsList; 