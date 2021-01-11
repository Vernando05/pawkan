import { RouteConfig } from 'vue-router';

export interface Language {
  text: string;
  value: string;
}
export interface CustomerInput {
  firstName: string
  lastName: string
  email: string
  token?: string
}
export interface LanguageState {
  language: string;
}
export interface AuthState {
  isAuthenticated: boolean;
}
export interface UiState {
  customerAccessToken: string
  prevNav: RouteConfig
}
export interface RootState {
  version: string;
}
declare global {
  interface Window {
      init:any;
  }
}