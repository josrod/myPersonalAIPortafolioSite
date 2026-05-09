import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { UseCases } from "./components/UseCases";
import { Contact } from "./components/Contact";
import { Consultation } from "./components/Consultation";
import { AIApp } from "./components/AIApp";
import { AdminDashboard } from "./components/AdminDashboard";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "use-cases", Component: UseCases },
      { path: "contact", Component: Contact },
      { path: "consultation", Component: Consultation },
      { path: "ai-app", Component: AIApp },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
