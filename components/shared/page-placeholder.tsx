type PagePlaceholderProps = {
  description: string;
};

export function PagePlaceholder({ description }: PagePlaceholderProps) {
  return (
    <p className="text-muted-foreground max-w-prose text-sm leading-relaxed">
      {description}
    </p>
  );
}
