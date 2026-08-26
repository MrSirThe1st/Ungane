import { EmptyState } from "@/components/shared/empty-state";

type PagePlaceholderProps = {
  description: string;
};

/** @deprecated Prefer EmptyState for branded empty screens. */
export function PagePlaceholder({ description }: PagePlaceholderProps) {
  return (
    <EmptyState title="Bientôt disponible" description={description} />
  );
}
