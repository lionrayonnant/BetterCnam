import React from 'react';
import { UESelectionnee } from '../types';

interface UECardProps {
  ue: UESelectionnee;
  onStatusChange: (code: string, statut: UESelectionnee['statut']) => void;
  onNoteChange: (code: string, note: number) => void;
  onCommentChange: (code: string, commentaire: string) => void;
}

const statusIcons: Record<UESelectionnee['statut'], string> = {
  to_do: '📝',
  in_progress: '⏳',
  completed: '✅',
  not_selected: '➖',
};

const UECard: React.FC<UECardProps> = ({ 
  ue, 
  onStatusChange, 
  onNoteChange, 
  onCommentChange 
}) => {
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      case 'to_do': return 'status-not-started';
      case 'not_selected': return 'status-not-selected';
      default: return '';
    }
  };

  return (
    <div className={`ue-card ${getStatusColor(ue.statut)}`}>
      <div className="ue-header">
        <h3 className="ue-code">
          <span className="ue-status-icon" title={ue.statut}>{statusIcons[ue.statut]}</span>
          {ue.code}
        </h3>
        <select 
          value={ue.statut}
          onChange={(e) => onStatusChange(ue.code, e.target.value as UESelectionnee['statut'])}
          className="status-select"
        >
          <option value="not_selected">Not Selected</option>
          <option value="to_do">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <p className="ue-title">{ue.nom}</p>
      
      {ue.statut === 'in_progress' && (
        <div className="ue-progress">
          <label>Progress Notes:</label>
          <textarea
            value={ue.commentaire || ''}
            onChange={(e) => onCommentChange(ue.code, e.target.value)}
            placeholder="Add your progress notes..."
            className="comment-input"
          />
        </div>
      )}
      
      {ue.statut === 'completed' && (
        <div className="ue-completion">
          <label>Grade (0-20):</label>
          <input
            type="number"
            min="0"
            max="20"
            value={ue.note || ''}
            onChange={(e) => onNoteChange(ue.code, Number(e.target.value))}
            className="grade-input"
          />
          <label>Comments:</label>
          <textarea
            value={ue.commentaire || ''}
            onChange={(e) => onCommentChange(ue.code, e.target.value)}
            placeholder="Add your comments..."
            className="comment-input"
          />
        </div>
      )}
    </div>
  );
};

export default UECard; 