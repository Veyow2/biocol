const BASE_URL = 'https://opendata.agencebio.org/api/gouv/operateurs';

type OperatorParams = {
  q?: string;
  nom?: string;
  departements?: string;
  lat?: number;
  lng?: number;
  nb?: number;
  debut?: number;
  trierPar?: string;
};

export const fetchOperators = async (params: OperatorParams = {}): Promise<any> => {
  const {
    q,
    nom,
    departements,
    lat,
    lng,
    nb = 10,
    debut = 0,
    trierPar = 'coords',
  } = params;

  const query = new URLSearchParams();

  if (q) query.append('q', q);
  if (nom) query.append('nom', nom);
  if (departements) query.append('departements', departements);
  if (lat !== undefined) query.append('lat', lat.toString());
  if (lng !== undefined) query.append('lng', lng.toString());
  query.append('nb', nb.toString());
  query.append('debut', debut.toString());
  query.append('trierPar', trierPar);

  const fullUrl = `${BASE_URL}?${query.toString()}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Erreur API Agence Bio :', error);
    throw error;
  }
};
