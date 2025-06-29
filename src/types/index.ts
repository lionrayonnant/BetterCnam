export interface UE {
  code: string;
  nom: string;
}

export interface UESelectionnee extends UE {
  statut: 'not_selected' | 'to_do' | 'in_progress' | 'completed';
  note?: number;
  commentaire?: string;
}

export interface Progression {
  totalUEs: number;
  uesTerminees: number;
  uesEnCours: number;
  uesNonCommencees: number;
  pourcentageTermine: number;
}

export interface Filtres {
  statut: 'tous' | 'not_selected' | 'to_do' | 'in_progress' | 'completed';
  recherche: string;
  afficherSelectionnees: boolean;
}

export interface StatistiquesNotes {
  moyenne: number;
  mediane: number;
  meilleureNote: number;
  pireNote: number;
  nombreNotes: number;
  repartition: Record<string, number>;
}

export type Onglet = 'avancement' | 'statistiques' | 'donnees'; 