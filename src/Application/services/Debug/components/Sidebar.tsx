import React from 'react';
import { FiLock, FiKey, FiList, FiTerminal, FiPackage, FiSearch, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import '../styles/Sidebar.css';

interface SidebarProps {
    expandedSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
    currentSection: string;
    setCurrentSection: (section: string) => void;
}

interface NavItem {
    id: string;
    title: string;
    icon: React.ReactNode;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        id: 'auth',
        title: 'Authentication',
        icon: <FiLock />,
        children: [
            { id: 'flow', title: 'Auth Flow', icon: <FiKey /> },
            { id: 'token', title: 'Token', icon: <FiList /> }
        ]
    },
    {
        id: 'listings',
        title: 'Listings',
        icon: <FiPackage />,
        children: [
            { id: 'listing-search', title: 'Search', icon: <FiSearch /> },
            { id: 'listing-management', title: 'Management', icon: <FiDollarSign /> },
            { id: 'listing-analytics', title: 'Analytics', icon: <FiTrendingUp /> },
            { id: 'featured-listings', title: 'Featured', icon: <FiList /> }
        ]
    },
    {
        id: 'logs',
        title: 'Debug Logs',
        icon: <FiTerminal />
    }
];

const Sidebar: React.FC<SidebarProps> = ({
    expandedSections,
    toggleSection,
    currentSection,
    setCurrentSection
}) => {
    const handleItemClick = (id: string) => {
        setCurrentSection(id);
        toggleSection(id);
    };

    const renderNavItem = (item: NavItem) => {
        const isActive = currentSection === item.id;
        const isExpanded = expandedSections[item.id];

        return (
            <div key={item.id} className="nav-item-container">
                <div
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-title">{item.title}</span>
                </div>
                {item.children && isExpanded && (
                    <div className="nav-children">
                        {item.children.map(child => renderNavItem(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="debug-sidebar">
            <div className="sidebar-header">
                <h2>Debug Tools</h2>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => renderNavItem(item))}
            </nav>
        </div>
    );
};

export default Sidebar; 