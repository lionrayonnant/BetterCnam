import { UE, UESelectionnee } from '../types';

export const chargerUEs = (): UE[] => {
  try {
    const uesData = require('../ue_results.json');
    // Transformer l'objet en tableau d'UEs
    return Object.entries(uesData as Record<string, string>).map(([code, nom]) => ({
      code,
      nom
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des UEs:', error);
    return [];
  }
};

export const sauvegarderProgression = (progression: Record<string, UESelectionnee>): void => {
  try {
    localStorage.setItem('cnam_progression', JSON.stringify(progression));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
  }
};

export const chargerProgression = (): Record<string, UESelectionnee> => {
  try {
    const progression = localStorage.getItem('cnam_progression');
    return progression ? JSON.parse(progression) : {};
  } catch (error) {
    console.error('Erreur lors du chargement de la progression:', error);
    return {};
  }
};

export const exporterDonnees = (progression: Record<string, UESelectionnee>): void => {
  try {
    const donnees = {
      progression,
      dateExport: new Date().toISOString(),
      version: '1.0.0',
      nombreUEs: Object.keys(progression).length
    };

    const blob = new Blob([JSON.stringify(donnees, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cnam-progression-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors de l\'export des données:', error);
    throw new Error('Impossible d\'exporter les données');
  }
};

export const importerDonnees = async (file: File): Promise<Record<string, UESelectionnee>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const contenu = event.target?.result as string;
        const donnees = JSON.parse(contenu);
        
        // Validation des données
        if (!donnees.progression || typeof donnees.progression !== 'object') {
          throw new Error('Format de fichier invalide');
        }
        
        // Vérifier que les données contiennent des UEs valides
        const progression = donnees.progression as Record<string, UESelectionnee>;
        const uesValides = Object.values(progression).every(ue => 
          ue && typeof ue === 'object' && 
          typeof ue.code === 'string' && 
          typeof ue.nom === 'string' &&
          ['not_selected', 'to_do', 'in_progress', 'completed'].includes(ue.statut)
        );
        
        if (!uesValides) {
          throw new Error('Données de progression invalides');
        }
        
        resolve(progression);
      } catch (error) {
        reject(new Error('Fichier corrompu ou format invalide'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsText(file);
  });
}; 