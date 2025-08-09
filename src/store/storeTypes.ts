// types.ts

// Define user data type
export interface UserData {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string;
  canteenId: number | null;
  createdAt: string; 
  updatedAt: string;
  role: string; // e.g., "restaurant-admin", "restaurant-manager", etc.
  userRoles: Array<{
    role: {
      id: number;
      name: string; // e.g., "restaurant-admin", "restaurant-manager"
    };
  }>;
}
// App state structure
export interface AppState {
  currentUserData: UserData | null;
  role: string; // User's role, e.g., "restaurant-admin", "restaurant-manager"
}

// Action type
export interface Action {
  type: string;
  payload?: any;
}
