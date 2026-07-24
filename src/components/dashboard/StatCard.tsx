// src/components/dashboard/StatCard.tsx
export default function StatCard({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <p className="text-[13px] text-white/60 mb-1.5">{label}</p>
      <p className={`text-2xl font-medium ${danger ? "text-red-400" : ""}`}>
        {value}
      </p>
    </div>
  );
}
