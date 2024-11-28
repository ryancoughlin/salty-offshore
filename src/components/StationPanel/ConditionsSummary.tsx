import { ChartBarIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface ConditionsSummaryProps {
  summaries: {
    current: string;
    week: string;
    bestDay: string;
  };
}

const ConditionsSummary: React.FC<ConditionsSummaryProps> = ({ summaries }) => {
  return (
    <div className="bg-neutral-900 rounded-lg p-4 space-y-3 border border-white/10">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <ChartBarIcon className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Current</h3>
        </div>
        <p className="text-base">{summaries.current}</p>
      </div>
      
      <div className="border-t border-white/10 pt-3">
        <div className="flex items-center space-x-2 mb-1">
          <ClockIcon className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Week Ahead</h3>
        </div>
        <p className="text-neutral-100">{summaries.week}</p>
      </div>
      
      <div className="border-t border-white/10 pt-3">
        <div className="flex items-center space-x-2 mb-1">
          <CheckBadgeIcon className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wide">Best Conditions</h3>
        </div>
        <p className="text-neutral-100">{summaries.bestDay}</p>
      </div>
    </div>
  );
};

export default ConditionsSummary; 