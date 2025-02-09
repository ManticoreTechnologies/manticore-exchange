import { useState, useEffect } from 'react';
import axios from 'axios';

const useListingData = (id: string) => {
  const [listing, setListing] = useState<any>(null);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    axios.get(`/api/listing/${id}`)
      .then(response => {
        setListing(response.data.listing);
        setLikeCount(response.data.listing.hearts);
      })
      .catch(error => console.error('Error fetching listing:', error));
  }, [id]);
      
  return { listing, likeCount, setLikeCount };
  };

export default useListingData; 