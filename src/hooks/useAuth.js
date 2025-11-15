import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Runs the request to check logged-in user
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user");
      if (!res.ok) return null; 
      return res.json();
    },
    retry: false,
  });

  return {
    user,                     
    isLoading,               
    isAuthenticated: !!user,  
  };
}
