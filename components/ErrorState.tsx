export type ErrorStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
      <h2 className="text-lg font-semibold text-red-200">{title}</h2>
      <p className="mt-2 text-sm text-red-100/80">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
