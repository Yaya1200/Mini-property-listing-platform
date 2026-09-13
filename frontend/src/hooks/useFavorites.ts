import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favorites.service';

export const useFavorites = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['favorites', page, limit],
    queryFn: () => favoritesService.getUserFavorites(page, limit),
    staleTime: 3 * 60 * 1000,
  });
};

export const useIsFavorite = (propertyId: string) => {
  return useQuery({
    queryKey: ['isFavorite', propertyId],
    queryFn: () => favoritesService.isFavorite(propertyId),
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritesService.addFavorite,
    onSuccess: (_, propertyId) => {
      // Optimistic update
      queryClient.setQueryData(['isFavorite', propertyId], { isFavorite: true });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritesService.removeFavorite,
    onSuccess: (_, propertyId) => {
      // Optimistic update
      queryClient.setQueryData(['isFavorite', propertyId], { isFavorite: false });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
