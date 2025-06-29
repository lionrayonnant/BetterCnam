import React from 'react';
import { Progression } from '../types';

interface ProgressionCardProps {
  progression: Progression;
  showCircle?: boolean;
}

const ProgressionCard: React.FC<ProgressionCardProps> = ({ progression, showCircle }) => {
  const { totalUEs, uesTerminees, uesEnCours, uesNonCommencees, pourcentageTermine } = progression;

  // Cercle de progression SVG
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.round(pourcentageTermine);
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="progression-card">
      <h2>Votre progression</h2>
      {showCircle && (
        <div className="progression-circle">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="#f3c2c6"
              fill="none"
              strokeWidth={stroke}
              cx={radius}
              cy={radius}
              r={normalizedRadius}
            />
            <circle
              stroke="#b5121b"
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
              cx={radius}
              cy={radius}
              r={normalizedRadius}
            />
          </svg>
          <div className="progression-circle-text">{percent}%</div>
        </div>
      )}
      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-number completed">{uesTerminees}</span>
          <span className="stat-label">Terminées</span>
        </div>
        <div className="stat-item">
          <span className="stat-number in-progress">{uesEnCours}</span>
          <span className="stat-label">En cours</span>
        </div>
        <div className="stat-item">
          <span className="stat-number not-started">{uesNonCommencees}</span>
          <span className="stat-label">À faire</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{totalUEs}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressionCard; 