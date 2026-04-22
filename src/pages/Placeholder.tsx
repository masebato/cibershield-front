import { Construction } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      <Card className="flex flex-col items-center justify-center min-h-64 border-dashed border-slate-700">
        <Construction className="w-8 h-8 text-slate-600 mb-3" />
        <p className="text-sm text-slate-500">This section is under construction</p>
        <p className="text-xs text-slate-600 mt-1">
          {/* TODO: Implement {title} page */}
          Backend integration required
        </p>
      </Card>
    </div>
  );
}
