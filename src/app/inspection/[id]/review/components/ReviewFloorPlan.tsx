'use client';

interface ReviewFloorPlanProps {
  floorPlanUrl: string;
  issues: Array<{
    x: number;
    y: number;
    issueNumber: number;
  }>;
}

export default function ReviewFloorPlan({ floorPlanUrl, issues }: ReviewFloorPlanProps) {
  return (
    <div className="mb-16 avoid-page-break">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-red-600"></span>
        Übersichtsplan & Issue-Verortung
      </h2>
      
      <div className="relative border-2 border-zinc-100 rounded-3xl overflow-hidden bg-zinc-50 shadow-sm">
        <img 
          src={floorPlanUrl} 
          alt="Floor Plan" 
          crossOrigin="anonymous"
          className="w-full h-auto block max-h-[500px] object-contain"
        />
        
        {issues.map((issue, idx) => (
          <div 
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
          >
            <div className="relative group">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white">
                {issue.issueNumber}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Issue {issue.issueNumber}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-zinc-400 mt-4 italic text-center uppercase tracking-widest">
        * Die Markierungen zeigen die genaue Position der festgestellten Mängel im Grundriss.
      </p>
    </div>
  );
}
