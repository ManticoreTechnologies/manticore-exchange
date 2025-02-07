import React from 'react';
import './ParallelProcessing.css';

interface ParallelProcessingProps {
  lanes?: number;
  transactionsPerLane?: number;
}

export const ParallelProcessing: React.FC<ParallelProcessingProps> = ({
  lanes = 3,
  transactionsPerLane = 4
}) => {
  return (
    <div className="parallel-processing">
      <div className="parallel-lanes">
        {Array.from({ length: lanes }).map((_, laneIndex) => (
          <div key={laneIndex} className="processing-lane">
            <div className="lane-transactions">
              {Array.from({ length: transactionsPerLane }).map((_, txIndex) => (
                <div 
                  key={txIndex} 
                  className="transaction-block"
                  style={{ animationDelay: `${laneIndex * 0.5 + txIndex * 1.5}s` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParallelProcessing; 