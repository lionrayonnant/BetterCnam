import React, { useState, useEffect } from 'react';
import ProgressionCard from './components/ProgressionCard';
import UECard from './components/UECard';
import SearchAndFilter from './components/SearchAndFilter';
import StatistiquesNotes from './components/StatistiquesNotes';
import GestionnaireDonnees from './components/GestionnaireDonnees';
import { chargerUEs, sauvegarderProgression, chargerProgression } from './utils/dataLoader';
import { UE, UESelectionnee, Progression, Filtres, StatistiquesNotes as StatsNotes, Onglet } from './types';
import './App.css';

const App: React.FC = () => {
  const [ues, setUes] = useState<UE[]>([]);
  const [uesSelectionnees, setUesSelectionnees] = useState<Record<string, UESelectionnee>>({});
  const [filtres, setFiltres] = useState<Filtres>({
    statut: 'tous',
    recherche: '',
    afficherSelectionnees: true
  });
  const [ongletActif, setOngletActif] = useState<Onglet>('avancement');

  useEffect(() => {
    const uesData = chargerUEs();
    setUes(uesData);
    
    const progressionSauvegardee = chargerProgression();
    setUesSelectionnees(progressionSauvegardee);
  }, []);

  useEffect(() => {
    sauvegarderProgression(uesSelectionnees);
  }, [uesSelectionnees]);

  // Gestion automatique du filtre "afficherSelectionnees"
  useEffect(() => {
    if (filtres.recherche) {
      // Si on recherche, on affiche toutes les UEs
      setFiltres(prev => ({ ...prev, afficherSelectionnees: false }));
    } else {
      // Sinon, on affiche uniquement les UEs sélectionnées par défaut
      setFiltres(prev => ({ ...prev, afficherSelectionnees: true }));
    }
  }, [filtres.recherche]);

  const calculerProgression = (): Progression => {
    // Compter uniquement les UEs sélectionnées (qui ont un statut différent de not_selected)
    const uesSelectionneesList = Object.values(uesSelectionnees).filter(ue => ue.statut !== 'not_selected');
    const total = uesSelectionneesList.length;
    const terminees = uesSelectionneesList.filter(ue => ue.statut === 'completed').length;
    const enCours = uesSelectionneesList.filter(ue => ue.statut === 'in_progress').length;
    const nonCommencees = uesSelectionneesList.filter(ue => ue.statut === 'to_do').length;
    const pourcentage = total > 0 ? (terminees / total) * 100 : 0;

    return {
      totalUEs: total,
      uesTerminees: terminees,
      uesEnCours: enCours,
      uesNonCommencees: nonCommencees,
      pourcentageTermine: pourcentage
    };
  };

  const calculerStatistiquesNotes = (): StatsNotes => {
    const uesAvecNotes = Object.values(uesSelectionnees)
      .filter(ue => ue.statut === 'completed' && ue.note !== undefined)
      .map(ue => ue.note!);

    if (uesAvecNotes.length === 0) {
      return {
        moyenne: 0,
        mediane: 0,
        meilleureNote: 0,
        pireNote: 0,
        nombreNotes: 0,
        repartition: {}
      };
    }

    const notesTriees = [...uesAvecNotes].sort((a, b) => a - b);
    const moyenne = uesAvecNotes.reduce((sum, note) => sum + note, 0) / uesAvecNotes.length;
    const mediane = notesTriees[Math.floor(notesTriees.length / 2)];
    const meilleureNote = Math.max(...uesAvecNotes);
    const pireNote = Math.min(...uesAvecNotes);

    // Calculer la répartition des notes
    const repartition: Record<string, number> = {};
    uesAvecNotes.forEach(note => {
      const tranche = `${Math.floor(note / 5) * 5}-${Math.floor(note / 5) * 5 + 4}`;
      repartition[tranche] = (repartition[tranche] || 0) + 1;
    });

    return {
      moyenne: Math.round(moyenne * 100) / 100,
      mediane,
      meilleureNote,
      pireNote,
      nombreNotes: uesAvecNotes.length,
      repartition
    };
  };

  const filtrerUEs = (): UESelectionnee[] => {
    let uesFiltrees = ues.map(ue => {
      const ueSelectionnee = uesSelectionnees[ue.code];
      return ueSelectionnee || { ...ue, statut: 'not_selected' };
    });

    // Filtrer pour afficher uniquement les UEs sélectionnées
    if (filtres.afficherSelectionnees) {
      uesFiltrees = uesFiltrees.filter(ue => ue.statut !== 'not_selected');
    }

    if (filtres.statut !== 'tous') {
      uesFiltrees = uesFiltrees.filter(ue => ue.statut === filtres.statut);
    }

    if (filtres.recherche) {
      const rechercheLower = filtres.recherche.toLowerCase();
      uesFiltrees = uesFiltrees.filter(ue => 
        ue.code.toLowerCase().includes(rechercheLower) ||
        ue.nom.toLowerCase().includes(rechercheLower)
      );
    }

    return uesFiltrees;
  };

  const handleStatusChange = (code: string, statut: UESelectionnee['statut']) => {
    setUesSelectionnees(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        code,
        nom: ues.find(ue => ue.code === code)?.nom || '',
        statut
      }
    }));
  };

  const handleNoteChange = (code: string, note: number) => {
    setUesSelectionnees(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        note
      }
    }));
  };

  const handleCommentChange = (code: string, commentaire: string) => {
    setUesSelectionnees(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        commentaire
      }
    }));
  };

  const progression = calculerProgression();
  const statistiques = calculerStatistiquesNotes();
  const uesFiltrees = filtrerUEs();

  // Icônes pour les onglets
  const tabIcons: Record<Onglet, string> = {
    avancement: '📋',
    statistiques: '📊',
    donnees: '💾',
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="header-logo" aria-label="logo">📚</span>
          <div>
            <div className="header-title">BetterCnam</div>
            <div className="header-subtitle">Suivi des UEs du CNAM</div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <ProgressionCard progression={progression} showCircle />
        
        <div className="onglets-container">
          <div className="onglets-header">
            <button 
              className={`onglet-btn ${ongletActif === 'avancement' ? 'actif' : ''}`}
              onClick={() => setOngletActif('avancement')}
            >
              <span className="tab-icon">{tabIcons.avancement}</span>
              Tableau d'avancement
            </button>
            <button 
              className={`onglet-btn ${ongletActif === 'statistiques' ? 'actif' : ''}`}
              onClick={() => setOngletActif('statistiques')}
            >
              <span className="tab-icon">{tabIcons.statistiques}</span>
              Statistiques des notes
            </button>
            <button 
              className={`onglet-btn ${ongletActif === 'donnees' ? 'actif' : ''}`}
              onClick={() => setOngletActif('donnees')}
            >
              <span className="tab-icon">{tabIcons.donnees}</span>
              Gestion des données
            </button>
          </div>

          <div className="onglet-content">
            {ongletActif === 'avancement' && (
              <>
                <SearchAndFilter 
                  filtres={filtres}
                  onFiltresChange={setFiltres}
                />

                <div className="ues-grid">
                  {uesFiltrees.map(ue => (
                    <UECard
                      key={ue.code}
                      ue={ue}
                      onStatusChange={handleStatusChange}
                      onNoteChange={handleNoteChange}
                      onCommentChange={handleCommentChange}
                    />
                  ))}
                </div>

                {uesFiltrees.length === 0 && (
                  <div className="no-results">
                    <p>No UEs found matching your criteria.</p>
                  </div>
                )}
              </>
            )}

            {ongletActif === 'statistiques' && (
              <StatistiquesNotes statistiques={statistiques} />
            )}

            {ongletActif === 'donnees' && (
              <GestionnaireDonnees
                progression={uesSelectionnees}
                onProgressionChange={setUesSelectionnees}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 