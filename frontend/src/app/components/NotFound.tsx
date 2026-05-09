import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-9xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-4xl text-slate-900 mb-4">{t("notFound.title")}</h1>
        <p className="text-xl text-slate-600 mb-8">
          {t("notFound.description")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              {t("notFound.goHome")}
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            {t("notFound.goBack")}
          </Button>
        </div>
      </div>
    </div>
  );
}