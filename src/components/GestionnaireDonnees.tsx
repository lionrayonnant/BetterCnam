import React, { useRef, useState } from 'react';
import { UESelectionnee } from '../types';
import { exporterDonnees, importerDonnees } from '../utils/dataLoader';

interface GestionnaireDonneesProps {
  progression: Record<string, UESelectionnee>;
  onProgressionChange: (progression: Record<string, UESelectionnee>) => void;
}

const GestionnaireDonnees: React.FC<GestionnaireDonneesProps> = ({
  progression,
  onProgressionChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    try {
      exporterDonnees(progression);
      setMessage({ type: 'success', text: 'Données exportées avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'export des données' });
    }
    
    // Effacer le message après 3 secondes
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage(null);

    try {
      const nouvellesDonnees = await importerDonnees(file);
      
      // Demander confirmation si des données existent déjà
      const nombreUEsExistantes = Object.keys(progression).length;
      const nombreUEsImportees = Object.keys(nouvellesDonnees).length;
      
      if (nombreUEsExistantes > 0) {
        const confirmer = window.confirm(
          `Vous avez actuellement ${nombreUEsExistantes} UEs configurées.\n` +
          `Le fichier importé contient ${nombreUEsImportees} UEs.\n\n` +
          `Voulez-vous remplacer vos données actuelles par celles du fichier ?`
        );
        
        if (!confirmer) {
          setIsImporting(false);
          return;
        }
      }

      onProgressionChange(nouvellesDonnees);
      setMessage({ 
        type: 'success', 
        text: `${nombreUEsImportees} UEs importées avec succès !` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de l\'import' 
      });
    } finally {
      setIsImporting(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    
    // Effacer le message après 5 secondes
    setTimeout(() => setMessage(null), 5000);
  };

  const handleReset = () => {
    const confirmer = window.confirm(
      'Êtes-vous sûr de vouloir supprimer toutes vos données ?\n' +
      'Cette action est irréversible.'
    );
    
    if (confirmer) {
      onProgressionChange({});
      setMessage({ type: 'success', text: 'Toutes les données ont été supprimées' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const nombreUEs = Object.keys(progression).length;
  const uesSelectionnees = Object.values(progression).filter(ue => ue.statut !== 'not_selected').length;

  return (
    <div className="gestionnaire-donnees">
      <h2>Gestion des données</h2>
      
      <div className="donnees-stats">
        <div className="stat-item">
          <span className="stat-label">UEs configurées</span>
          <span className="stat-value">{nombreUEs}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">UEs sélectionnées</span>
          <span className="stat-value">{uesSelectionnees}</span>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="actions-container">
        <div className="action-group">
          <h3>Exporter mes données</h3>
          <p>Sauvegardez vos données sur votre ordinateur</p>
          <button 
            onClick={handleExport}
            className="btn-export"
            disabled={nombreUEs === 0}
          >
            📥 Exporter les données
          </button>
        </div>

        <div className="action-group">
          <h3>Importer des données</h3>
          <p>Restorez des données depuis un fichier</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-import"
            disabled={isImporting}
          >
            {isImporting ? '⏳ Import en cours...' : '📤 Importer des données'}
          </button>
        </div>

        <div className="action-group">
          <h3>Réinitialiser</h3>
          <p>Supprimez toutes vos données</p>
          <button 
            onClick={handleReset}
            className="btn-reset"
            disabled={nombreUEs === 0}
          >
            🗑️ Supprimer toutes les données
          </button>
        </div>
      </div>

      <div className="info-section">
        <h3>Informations</h3>
        <ul>
          <li>Les données sont sauvegardées automatiquement dans votre navigateur</li>
          <li>L'export crée un fichier JSON que vous pouvez partager ou sauvegarder</li>
          <li>L'import remplace toutes vos données actuelles</li>
          <li>Faites une sauvegarde avant d'importer de nouvelles données</li>
        </ul>
      </div>
    </div>
  );
};

export default GestionnaireDonnees; 