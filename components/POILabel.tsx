import React from 'react';
import { POI } from '../types';
import './POILabel.css';

interface POILabelProps {
    poi: POI;
    isActive: boolean;
    onClick?: () => void;
}

const POILabel: React.FC<POILabelProps> = ({ poi, isActive, onClick }) => {
    return (
        <div
            className={`poi-label ${isActive ? 'active' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <span className="poi-icon">📍</span>
            {isActive && (
                <div className="poi-content">
                    <div className="poi-title">{poi.label}</div>
                    {poi.description && (
                        <div className="poi-description">{poi.description}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default POILabel;
