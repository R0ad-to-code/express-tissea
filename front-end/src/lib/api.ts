
type ApiError = {
  message: string;
  status?: number;
};

// Base API URL - À remplacer par l'URL réelle de votre API
const API_BASE_URL = "http://localhost:5000/api";

// Helper pour gérer les erreurs de l'API
const handleApiError = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || `Erreur ${response.status}: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }
  return response.json();
};

// Helper pour construire les requêtes avec le token d'authentification
const getAuthHeaders = () => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return {};
  
  try {
    const user = JSON.parse(userJson);
    return {
      Authorization: `Bearer ${user.token}`,
    };
  } catch (error) {
    console.error("Failed to parse user token", error);
    return {};
  }
};

export const api = {
  // Authentification
  async signup(email: string, password: string, admin: boolean) {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, admin }),
    });
    return handleApiError(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return handleApiError(response);
  },

  // Catégories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Details par catégorie 
  async getInfosByCategory(categoryId: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Lignes par catégorie
  async getLinesByCategory(categoryId: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lines`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Détails d'une ligne
  async getLineDetails(categoryId: string, lineId: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lines/${lineId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Arrêts d'une ligne
  async getLineStops(categoryId: string, lineId: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lines/${lineId}/stops`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Distance entre deux arrêts
  async getDistanceBetweenStops(stopId1: string, stopId2: string) {
    const response = await fetch(`${API_BASE_URL}/stats/distance/stops/${stopId1}/${stopId2}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Distance totale d'une ligne
  async getLineDistance(lineId: string) {
    const response = await fetch(`${API_BASE_URL}/stats/distance/lines/${lineId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleApiError(response);
  },

  // Ajouter un arrêt à une ligne
  async addStopToLine(categoryId: string, lineId: string, stopData: any) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lines/${lineId}/stops`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(stopData),
    });
    return handleApiError(response);
  },

   // Ajouter un arrêt à une ligne
   async deleteStop(categoryId: string, lineId: string, stopId: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lines/${lineId}/stops/${stopId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      }
    });
    return handleApiError(response);
  },

  // Modifier une ligne
  async updateLine(categoryId: string, lineId: string, lineData: any) {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/lines/${lineId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(lineData),
    });
    return handleApiError(response);
  },
};
