import React from 'react';
import '../../styles/AssetTypesTable.css'; // Ensure you have an AssetTypesTable.css for styling

// Define the type for each asset type entry
interface AssetType {
  name: string;
  prefix: string;
  description: string;
  cost: number;
}

const AssetTypesTable: React.FC = () => {
  const assetTypes: AssetType[] = [
    {
      name: 'Main Assets',
      prefix: 'No special prefix',
      description: 'Like a domain name; requires ownership asset to create sub-assets or unique assets.',
      cost: 500
    },
    {
      name: 'Sub-assets',
      prefix: '[main asset name]/[sub-portion]',
      description: 'Like a path within a website or a filesystem subdirectory; requires a main asset ownership token.',
      cost: 100
    },
    {
      name: 'Unique Assets',
      prefix: '[main or sub asset name]#[unique portion]',
      description: 'Comparable to a file on a website; can only be one; requires a main asset or sub-asset ownership token.',
      cost: 5
    },
    {
      name: 'Message Channels',
      prefix: '[main or sub asset name]~[message channel portion]',
      description: 'Made for broadcasting messages; requires a main or sub-asset\'s ownership asset.',
      cost: 100
    },
    {
      name: 'Qualifiers',
      prefix: '#[qualifier portion]',
      description: 'Administrative assets used to determine what addresses can receive restricted assets.',
      cost: 1000
    },
    {
      name: 'Sub-qualifiers',
      prefix: '#[qualifier portion]/#[sub-qualifier]',
      description: 'Similar powers as qualifiers; uses a parent qualifier asset instead of a parent ownership asset.',
      cost: 100
    },
    {
      name: 'Restricted Assets',
      prefix: '$[restricted portion]',
      description: 'Comparable to main assets but are restricted; require a qualifier.',
      cost: 1500
    }
  ];

  return (
    <div className="asset-types-table">
      <h1>Types of Evrmore Assets</h1>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Prefix</th>
            <th>Description</th>
            <th>Minting Cost</th>
          </tr>
        </thead>
        <tbody>
          {assetTypes.map((type, index) => (
            <tr key={index}>
              <td>{type.name}</td>
              <td>{type.prefix}</td>
              <td>{type.description}</td>
              <td>{type.cost} EVR</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTypesTable;
