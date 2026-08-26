type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="border-border bg-card/80 border-b px-4 py-5 backdrop-blur-sm md:px-8">
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
      {description ? (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      ) : null}
    </header>
  );
}
