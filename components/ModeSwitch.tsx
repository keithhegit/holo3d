import React from 'react';
import { InteractionMode } from '../types';
import './ModeSwitch.css';

interface ModeSwitchProps {
    mode: InteractionMode;
    onModeChange: (mode: InteractionMode) => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onModeChange }) => {
    return (
        <div className="mode-switch">
            <button
                className={`mode-button ${mode === 'classic' ? 'active' : ''}`}
                onClick={() => onModeChange('classic')}
            >
                <span className="mode-icon">🖱️</span>
                <span className="mode-label">Classic</span>
            </button>
            <button
                className={`mode-button ${mode === 'gesture' ? 'active' : ''}`}
                onClick={() => onModeChange('gesture')}
            >
                <span className="mode-icon">✋</span>
                <span className="mode-label">Gesture</span>
            </button>
        </div>
    );
};

export default ModeSwitch;
