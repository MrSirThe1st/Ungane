import { redirect } from "next/navigation";

import { AppointmentsPanel } from "@/components/flows/appointments-panel";
import { FlowToggles } from "@/components/flows/flow-toggles";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentBusiness } from "@/lib/business/current";
import { isBusinessOwner } from "@/lib/business/roles";
import { listAppointments, listFlowSettings } from "@/lib/flows/actions";

export const revalidate = 60;

export default async function FlowsPage() {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");

  const [settings, appointments, canManageFlows] = await Promise.all([
    listFlowSettings(),
    listAppointments(),
    isBusinessOwner(),
  ]);

  const reminderEnabled =
    settings.find((s) => s.flowType === "reminder")?.enabled ?? false;
  const feedbackEnabled =
    settings.find((s) => s.flowType === "feedback")?.enabled ?? false;

  return (
    <>
      <PageHeader
        title="Flux WhatsApp"
        description="Modèles prêts à l’emploi — pas de constructeur visuel"
      />
      <div className="flex-1 space-y-8 px-4 py-6 md:px-8">
        <section>
          <h2 className="mb-3 text-base font-medium">Activer</h2>
          <FlowToggles settings={settings} canManage={canManageFlows} />
        </section>
        <section>
          <h2 className="mb-3 text-base font-medium">Rendez-vous</h2>
          <AppointmentsPanel
            appointments={appointments}
            reminderEnabled={reminderEnabled}
            feedbackEnabled={feedbackEnabled}
          />
        </section>
      </div>
    </>
  );
}
