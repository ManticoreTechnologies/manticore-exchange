import React from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';

interface VestingSchedule {
  cliff: string;
  duration: string;
  interval: string;
  tge: string;
}

interface VestingSchedules {
  team: VestingSchedule;
  advisors: VestingSchedule;
  publicSale: VestingSchedule;
}

interface VestingSectionProps {
  values: {
    vestingSchedules: VestingSchedules;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isActive: boolean;
}

const VestingSection: React.FC<VestingSectionProps> = ({ values, onChange, isActive }) => {
  if (!isActive) return null;

  const renderVestingGroup = (group: keyof VestingSchedules, label: string) => (
    <div className="vesting-group">
      <h3>{label}</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${group}-tge`}>
            TGE Release %
            <Tooltip content="Percentage to release at Token Generation Event" />
          </label>
          <input
            type="number"
            id={`${group}-tge`}
            name={`vestingSchedules.${group}.tge`}
            value={values.vestingSchedules[group].tge}
            onChange={onChange}
            min="0"
            max="100"
            placeholder="e.g., 10"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${group}-cliff`}>
            Cliff (days)
            <Tooltip content="Days to wait before vesting begins" />
          </label>
          <input
            type="number"
            id={`${group}-cliff`}
            name={`vestingSchedules.${group}.cliff`}
            value={values.vestingSchedules[group].cliff}
            onChange={onChange}
            min="0"
            placeholder="e.g., 90"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${group}-duration`}>
            Duration (days)
            <Tooltip content="Total vesting period in days" />
          </label>
          <input
            type="number"
            id={`${group}-duration`}
            name={`vestingSchedules.${group}.duration`}
            value={values.vestingSchedules[group].duration}
            onChange={onChange}
            min="1"
            placeholder="e.g., 365"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${group}-interval`}>
            Release Interval (days)
            <Tooltip content="Days between each token release" />
          </label>
          <input
            type="number"
            id={`${group}-interval`}
            name={`vestingSchedules.${group}.interval`}
            value={values.vestingSchedules[group].interval}
            onChange={onChange}
            min="1"
            placeholder="e.g., 30"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-section active">
      <h2>Vesting Schedules</h2>
      
      <div className="vesting-schedules">
        {renderVestingGroup('team', 'Team Vesting')}
        {renderVestingGroup('advisors', 'Advisors Vesting')}
        {renderVestingGroup('publicSale', 'Public Sale Vesting')}
      </div>

      <div className="vesting-timeline">
        {/* TODO: Add vesting timeline visualization */}
      </div>
    </div>
  );
};

export default VestingSection; 