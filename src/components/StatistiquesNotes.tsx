import React from 'react';
import { StatistiquesNotes as StatsNotes } from '../types';

interface StatistiquesNotesProps {
  statistiques: StatsNotes;
}

const StatistiquesNotes: React.FC<StatistiquesNotesProps> = ({ statistiques }) => {
  if (statistiques.nombreNotes === 0) {
    return (
      <div className="statistiques-container">
        <h2>Statistiques des notes</h2>
        <div className="no-notes">
          <p>Aucune note disponible. Complétez des UEs pour voir vos statistiques.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistiques-container">
      <h2>Statistiques des notes</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Moyenne</h3>
          <div className="stat-value">{statistiques.moyenne}/20</div>
        </div>
        
        <div className="stat-card">
          <h3>Médiane</h3>
          <div className="stat-value">{statistiques.mediane}/20</div>
        </div>
        
        <div className="stat-card">
          <h3>Meilleure note</h3>
          <div className="stat-value best">{statistiques.meilleureNote}/20</div>
        </div>
        
        <div className="stat-card">
          <h3>Pire note</h3>
          <div className="stat-value worst">{statistiques.pireNote}/20</div>
        </div>
        
        <div className="stat-card">
          <h3>Nombre de notes</h3>
          <div className="stat-value">{statistiques.nombreNotes}</div>
        </div>
      </div>

      <div className="repartition-container">
        <h3>Répartition des notes</h3>
        <div className="repartition-chart">
          {Object.entries(statistiques.repartition)
            .sort(([a], [b]) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]))
            .map(([tranche, nombre]) => (
              <div key={tranche} className="repartition-bar">
                <div className="bar-label">{tranche}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(nombre / statistiques.nombreNotes) * 100}%`,
                      backgroundColor: getBarColor(parseInt(tranche.split('-')[0]))
                    }}
                  ></div>
                </div>
                <div className="bar-value">{nombre}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const getBarColor = (noteMin: number): string => {
  if (noteMin >= 16) return '#28a745'; // Excellent
  if (noteMin >= 14) return '#20c997'; // Très bien
  if (noteMin >= 12) return '#17a2b8'; // Bien
  if (noteMin >= 10) return '#ffc107'; // Passable
  return '#dc3545'; // Insuffisant
};

export default StatistiquesNotes; 