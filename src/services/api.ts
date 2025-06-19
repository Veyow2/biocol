const BASE_URL = 'https://data.agencebio.org/api/gouv/operateurs/';

export async function fetchOperators(queryParams: string) {
  try {
    const response = await fetch(`${BASE_URL}?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API opérateurs :', error);
    throw error;
  }
}
