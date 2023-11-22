import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export default function Wrapper(props) {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
}
