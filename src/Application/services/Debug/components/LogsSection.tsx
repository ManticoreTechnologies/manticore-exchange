import React from 'react';
import { FiTerminal } from 'react-icons/fi';
import DebugSection from './DebugSection';
import '../styles/LogsSection.css';

interface LogsSectionProps {
    logs: string[];
    clearLogs: () => void;
    expandedSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
}

const LogsSection: React.FC<LogsSectionProps> = ({
    logs,
    clearLogs,
    expandedSections,
    toggleSection
}) => {
    return (
        <DebugSection
            id="logs"
            title="Debug Logs"
            icon={<FiTerminal />}
            isExpanded={expandedSections['logs']}
            onToggle={() => toggleSection('logs')}
        >
            <div className="logs-header">
                <button onClick={clearLogs} className="clear-logs">Clear Logs</button>
            </div>
            <div className="logs">
                {logs.map((log, index) => (
                    <div key={index} className="log-entry">{log}</div>
                ))}
            </div>
        </DebugSection>
    );
};

export default LogsSection; 