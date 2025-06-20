
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
