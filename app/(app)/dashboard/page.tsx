import { PageHeader } from "@/components/shared/page-header";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export const revalidate = 60;

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Tableau de bord" />
      <div className="flex-1 px-4 py-6 md:px-8">
        <PagePlaceholder description="Vue d’ensemble des clients, conversations et campagnes. Contenu à brancher." />
      </div>
    </>
  );
}
