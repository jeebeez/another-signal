import { useQuery } from "@tanstack/react-query"
import axiosInstance from "./axiosInstance"

import { Prospect } from "@/lib/types"

export const useAccountProspects = (companyName: string) => {
  return useQuery<Prospect[]>({
    queryKey: ["account-prospects", companyName],
    queryFn: () =>
      axiosInstance
        .get<Prospect[]>(`prospects/${companyName}`)
        .then(res => res.data),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })
}
