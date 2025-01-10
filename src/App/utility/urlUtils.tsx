import { useNavigate } from 'react-router-dom';

export const useUpdateURL = () => {
  const navigate = useNavigate();

  const updateURL = (search: string) => {
    navigate(`/transactions/${search}`);
  };

  return updateURL;
};
