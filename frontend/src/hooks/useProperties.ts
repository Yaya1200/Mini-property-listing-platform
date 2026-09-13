import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertiesService } from '@/services/properties.service';

export const useProperties = (
  page = 1,
  limit = 10,
  location?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  return useQuery({
    queryKey: ['properties', page, limit, location, minPrice, maxPrice],
    queryFn: () =>
      propertiesService.getProperties(page, limit, location, minPrice, maxPrice),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesService.getProperty(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOwnerProperties = (ownerId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['ownerProperties', ownerId, page, limit],
    queryFn: () => propertiesService.getOwnerProperties(ownerId, page, limit),
    staleTime: 3 * 60 * 1000,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertiesService.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['ownerProperties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      propertiesService.updateProperty(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(['property', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['ownerProperties'] });
    },
  });
};

export const usePublishProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertiesService.publishProperty,
    onSuccess: (data) => {
      queryClient.setQueryData(['property', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['ownerProperties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertiesService.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['ownerProperties'] });
    },
  });
};
