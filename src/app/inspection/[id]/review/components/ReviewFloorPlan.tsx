'use client';

interface ReviewFloorPlanProps {
  floorPlanUrl: string;
  issues: Array<{
    x: number;
    y: number;
    issueNumber: string;
  }>;
}

export default function ReviewFloorPlan({ floorPlanUrl, issues }: ReviewFloorPlanProps) {
  return (
    <div className="mb-8 md:mb-16 avoid-page-break">
      <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
        <span className="w-6 md:w-8 h-[2px] bg-red-600"></span>
        Übersichtsplan & Verortung
      </h2>
      
      <div className="relative border md:border-2 border-zinc-100 rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-50 shadow-sm">
        <img 
          src={floorPlanUrl.replace(/\.pdf$/i, '.jpg')} 
          alt="Floor Plan" 
          crossOrigin="anonymous"
          className="w-full h-auto block max-h-[300px] md:max-h-[500px] object-contain"
        />
        
        {issues.map((issue, idx) => (
          <div 
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${issue.x}%`, top: `${issue.y}%` }}
          >
            <div className="relative group">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-[8px] md:text-[10px] font-black border border-white md:border-2">
                {issue.issueNumber}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 md:mt-2 bg-black text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 md:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
