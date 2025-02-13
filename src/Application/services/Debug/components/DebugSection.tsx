import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import '../styles/DebugSection.css';

interface DebugSectionProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    description?: string;
    isSubsection?: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}

const DebugSection: React.FC<DebugSectionProps> = ({
    id,
    title,
    icon,
    description,
    isSubsection,
    isExpanded,
    onToggle,
    children
}) => {
    return (
        <div className={`debug-section ${isSubsection ? 'subsection' : ''}`}>
            <div className="section-header" onClick={onToggle}>
                <span className="header-icon">{icon}</span>
                <h2>{title}</h2>
                {description && (
                    <div className="section-description">{description}</div>
                )}
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isExpanded && (
                <div className="section-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DebugSection; 