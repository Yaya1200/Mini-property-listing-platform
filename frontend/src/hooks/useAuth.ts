import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { User } from '@/types/index';

export const useLogin = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);

      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      // Redirect based on the authenticated user's role.
      switch (data.user.role) {
        case 'admin':
          router.push('/admin');
          break;

        case 'property_owner':
          router.push('/owner');
          break;

        case 'regular_user':
          router.push('/dashboard');
          break;

        default:
          // Safe fallback if an unexpected role is returned.
          router.push('/');
          break;
      }
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,

    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);

      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      // New users go to the appropriate page based on their role.
      switch (data.user.role) {
        case 'admin':
          router.push('/admin');
          break;

        case 'property_owner':
          router.push('/owner');
          break;

        case 'regular_user':
          router.push('/dashboard');
          break;

        default:
          router.push('/');
          break;
      }
    },
  });
};

export const useCurrentUser = () => {
  const { setUser } = useAuthStore();

  const token = useAuthStore((state) => state.getToken());

  const query = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    enabled: !!token,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data as User);
    }
  }, [query.data, setUser]);

  return query;
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    router.push('/');
  };
};

