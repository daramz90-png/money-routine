import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Invest from "@/pages/invest";
import Tax from "@/pages/tax";
import Savings from "@/pages/savings";
import SideIncome from "@/pages/side-income";
import Tools from "@/pages/tools";
import Subscribe from "@/pages/subscribe";
import About from "@/pages/about";
import RealEstate from "@/pages/real-estate";
import Routine from "@/pages/routine";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/invest" component={Invest} />
      <Route path="/real-estate" component={RealEstate} />
      <Route path="/routine" component={Routine} />
      <Route path="/tools" component={Tools} />
      <Route path="/tax" component={Tax} />
      <Route path="/savings" component={Savings} />
      <Route path="/side-income" component={SideIncome} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
