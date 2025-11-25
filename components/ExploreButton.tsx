import React from 'react';
import './ExploreButton.css';

interface ExploreButtonProps {
    onExplore: () => void;
    activePOILabel?: string;
    disabled?: boolean;
}

const ExploreButton: React.FC<ExploreButtonProps> = ({
    onExplore,
    activePOILabel,
    disabled
}) => {
    return (
        <button
            className={`explore-button ${disabled ? 'disabled' : ''}`}
            onClick={onExplore}
            disabled={disabled}
        >
            <span className="explore-icon">🌍</span>
            <span className="explore-text">
                {activePOILabel ? `EXPLORE ${activePOILabel.toUpperCase()}` : 'EXPLORE'}
            </span>
            <span className="explore-arrow">→</span>
        </button>
    );
};

export default ExploreButton;
