export const AuthProvider = ({ children }: any) => {
  return children as any;
};

export const useAuth = () => ({
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
});

export default {
  AuthProvider,
  useAuth,
};
