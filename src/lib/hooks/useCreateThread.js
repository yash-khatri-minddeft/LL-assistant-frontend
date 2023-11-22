import { useQuery } from "@tanstack/react-query";

async function createThreadQueryFn(threadId) {
  if (threadId) return "";
  try {
    const res = await fetch("/api/create-thread", {
      method: "post",
    });
    if (res.ok && res.status == 200) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
  return "";
}

export function useCreateThread(threadId) {
  return useQuery({
    queryKey: ["create-thread", { threadId }],
    queryFn: async () => createThreadQueryFn(threadId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
