export type OperatorType = {
  id: string;
  denominationcourante: string;
  activites?: { nom: string }[];
  adressesOperateurs?: {
    lieu?: string;
    codePostal?: string;
    ville?: string;
    lat?: number;
    long?: number;
  }[];
  productions?: { id: string; nom: string }[];
  certificats?: {
    organisme: string;
    dateEngagement: string;
    url?: string;
  }[];
};

// ✅ Ce type doit être séparé et **exporté**
export type OperatorParams = {
  q?: string;
  nom?: string;              // ✅ ajout
  departements?: string;     // ✅ ajout
  lat?: number;
  lng?: number;
  nb?: number;
  debut?: number;            // ✅ ajout
  trierPar?: 'coords' | 'nom' | 'activites';
  rayon?: number;
};

