import { useMutation } from '@tanstack/react-query'
import { AskApi, AskRequest, AskResponse } from '@/utils/api/ask-api'

const useAsk = ({ onSuccess }: { onSuccess?: (res: AskResponse) => void } = {}) => {
  const {
    mutate: onAsk,
    mutateAsync: askAsync,
    data,
    error,
    isPending: isAsking,
    isSuccess,
    isError,
  } = useMutation<AskResponse, Error, AskRequest>({
    mutationFn: async (payload) => {
      const res = await AskApi.sendMessage(payload)
      console.log('hooks:', res)
      return res
    },
    onSuccess: (res) => {
      onSuccess?.(res)
    },
    retry: 0,
  })

  return {
    onAsk,               // untuk trigger manual
    askAsync,            // untuk async/await
    data,                // hasil response
    error,               // error saat gagal
    isAsking,            // status loading
    isSuccess,           // status sukses
    isError,             // status error
  }
}

export default useAsk
