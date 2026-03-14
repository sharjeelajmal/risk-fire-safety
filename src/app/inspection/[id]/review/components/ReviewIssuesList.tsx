'use client';

interface Issue {
  issueNumber: number;
  location: string;
  responsibleContractor: string;
  description: string;
  measures: string;
  priority: '1' | '2' | '3';
  images: string[];
}

export default function ReviewIssuesList({ issues }: { issues: Issue[] }) {
  return (
    <div className="space-y-12">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-3">
        <span className="w-8 h-[2px] bg-red-600"></span>
        Detaillierte Mängelliste
      </h2>

      {issues.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-zinc-100 rounded-3xl text-center">
          <p className="text-zinc-400 font-bold uppercase tracking-widest">Keine Mängel erfasst.</p>
        </div>
      ) : (
        issues.map((issue) => (
          <div key={issue.issueNumber} className="page-break-inside-avoid border-l-4 border-red-600 pl-8 py-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-4xl font-black text-zinc-200 block mb-1">#{issue.issueNumber}</span>
                <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">{issue.location}</h3>
              </div>
              <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${
                issue.priority === '3' ? 'bg-red-100 text-red-600' : 
                issue.priority === '2' ? 'bg-orange-100 text-orange-600' : 
                'bg-green-100 text-green-600'
              }`}>
                Priorität {issue.priority}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Problembeschreibung</label>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium">{issue.description}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Gegenmaßnahmen</label>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium italic">{issue.measures}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Verantwortlicher Unternehmer</label>
                  <p className="text-sm font-black text-zinc-900 uppercase tracking-wide">{issue.responsibleContractor}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-wrap">
                {issue.images?.map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                    <img 
                      src={url} 
                      alt={`Issue ${issue.issueNumber} photo ${i+1}`} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-[1px] w-full bg-zinc-100 mt-12"></div>
          </div>
        ))
      )}
    </div>
  );
}
