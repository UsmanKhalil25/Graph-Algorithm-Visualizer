import { useNavigate } from "react-router-dom";
import { TypographyH1 } from "@/components/ui/typographyH1";
import { Button } from "@/components/ui/button";

const NavigationButton = ({ path, label }: { path: string; label: string }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(path)}
      variant="outline"
      size="lg"
      className="w-full mt-4"
    >
      {label}
    </Button>
  );
};

export default function DefaultPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center space-y-20">
      <TypographyH1 text="Graph Algorithm Visualizer" />
      <div className="flex flex-col items-center">
        <NavigationButton
          path="/link-state"
          label="Link State (Dijkstra's Algorithm)"
        />
        <NavigationButton
          path="/distance-vector"
          label="Distance Vector (Bellman-Ford Algorithm)"
        />
      </div>
    </main>
  );
}
