import React, { useState } from 'react';
import api from '../../utility/api';
import './AssetNameGenerator.css';

interface APIResponse {
  data: any;
}

const AssetNameGenerator: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await api.get<APIResponse>('/generate/onewordgreek');
      setData(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
      setData('');
    }
  };

  return (
    <div className="asset-generator">
      <h1 className="title">Evrmore Asset Name Generator</h1>
      <button className="generate-button" onClick={fetchData}>Generate Data</button>
      {data && <p className="result">Result: {data}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AssetNameGenerator;

