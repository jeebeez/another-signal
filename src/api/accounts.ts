import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from './axiosInstance'
import { Account } from '@/lib/types'

export const useAllAccounts = () => {
  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: () => axiosInstance.get<Account[]>(`/accounts/all`).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

export const useAccount = (companyName: string) => {
  return useQuery<Account>({
    queryKey: ['account', companyName],
    queryFn: () => axiosInstance.get<Account>(`accounts/${companyName}`).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

export const useGenerateMagic = () => {
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, { question: string }>({
    mutationFn: (data) =>
      axiosInstance
        .post<boolean>('/magic/generate', {
          question: data.question,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}
