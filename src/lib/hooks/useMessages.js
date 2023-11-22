import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function messageQueryFn(threadId) {
  if (!threadId) return "";
  try {
    const res = await axios.post(
      "/api/get-messages",
      JSON.stringify({
        threadId,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status == 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
  return "";
}

export function useMessage(threadId, enabled = true) {
  return useQuery({
    queryKey: ["message", { threadId }],
    queryFn: async () => messageQueryFn(threadId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
}
