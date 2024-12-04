import Router from "@/router";
import { GraphProvider } from "./context/graph-context";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <GraphProvider>
      <Router />
      <Toaster />
    </GraphProvider>
  );
}

export default App;
