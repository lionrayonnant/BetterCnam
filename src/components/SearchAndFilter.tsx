import React from 'react';
import { Filtres } from '../types';

interface SearchAndFilterProps {
  filtres: Filtres;
  onFiltresChange: (filtres: Filtres) => void;
}

const statusLabels: Record<Filtres['statut'], string> = {
  tous: 'Toutes',
  not_selected: 'Non sélectionnées',
  to_do: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminées',
};

const ueTypeOptions = [
  { value: 'to_do', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminées' },
];

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filtres, onFiltresChange }) => {
  const handleSearchChange = (recherche: string) => {
    onFiltresChange({ ...filtres, recherche });
  };

  const handleStatusChange = (statut: Filtres['statut']) => {
    onFiltresChange({ ...filtres, statut });
  };

  const handleAfficherSelectionneesChange = (afficherSelectionnees: boolean) => {
    onFiltresChange({ ...filtres, afficherSelectionnees });
  };

  // Nouveau filtre par type d'UE (to_do, in_progress, completed)
  const handleUETypeChange = (type: string) => {
    onFiltresChange({ ...filtres, statut: type as Filtres['statut'] });
  };

  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher une UE par code ou nom..."
          value={filtres.recherche}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-box">
        <select
          value={filtres.statut}
          onChange={(e) => handleStatusChange(e.target.value as Filtres['statut'])}
          className="filter-select"
        >
          <option value="tous">Tous statuts</option>
          <option value="not_selected">Non sélectionnées</option>
          <option value="to_do">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminées</option>
        </select>
      </div>
      <div className="ue-type-filter">
        {ueTypeOptions.map(opt => (
          <button
            key={opt.value}
            className={`ue-type-btn${filtres.statut === opt.value ? ' actif' : ''}`}
            onClick={() => handleUETypeChange(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="checkbox-filter">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filtres.afficherSelectionnees}
            onChange={(e) => handleAfficherSelectionneesChange(e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-text">Afficher uniquement les UEs sélectionnées</span>
        </label>
      </div>
    </div>
  );
};

export default SearchAndFilter; 