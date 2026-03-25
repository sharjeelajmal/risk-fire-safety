import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingTop: 60, // Space for fixed header
    paddingBottom: 80, // Space for footer
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#27272a', // Softer dark slate
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#f4f4f5',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#18181b',
    letterSpacing: 0.5,
  },
  logo: {
    width: 150,
    height: 54,
    objectFit: 'contain',
  },
  logoPlaceholder: {
    fontSize: 8,
    color: '#CCCCCC',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#111111',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#111111',
  },
  footerAddress: {
    fontSize: 6,
    color: '#444444',
    textAlign: 'center',
    flex: 1,
  },
  
  // Cover Page
  coverContainer: {
    marginTop: 30,
    marginBottom: 30,
    padding: 0,
  },
  documentType: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#18181b',
    letterSpacing: -0.5,
  },
  companySub: {
    fontSize: 10,
    color: '#111111',
    marginBottom: 40,
    letterSpacing: 1,
  },
  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 60,
  },
  gridItem: {
    width: '50%',
    marginBottom: 15,
  },
  label: {
    fontSize: 8,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
    fontWeight: 'heavy',
  },
  value: {
    fontSize: 11,
    color: '#27272a',
    fontWeight: 'bold',
  },
  reportBadge: {
    backgroundColor: '#f4f4f5',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  badgeLabel: {
    color: '#71717a',
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeValue: {
    color: '#18181b',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Sections
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLine: {
    width: 30,
    height: 2,
    backgroundColor: '#DC2626',
    marginRight: 10,
  },
  notesBox: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 30,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginRight: 5,
  },
  
  // Legend
  legendGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
  },
  legendCard: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  levelLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  levelText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333333',
  },

  // Floor Plan
  mapContainer: {
    marginVertical: 20,
    position: 'relative',
    width: '100%',
  },
  mapImage: {
    width: '100%',
    maxHeight: 500,
    objectFit: 'contain',
  },
  pin: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#DC2626',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: 'bold',
  },

  // Issues
  issueCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  issueNumber: {
    fontSize: 16,
    fontWeight: 'heavy',
    color: '#DC2626',
  },
  issueLocation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    fontWeight: 'bold',
  },
  p1: { backgroundColor: '#FFEEF2', color: '#DC2626' },
  p2: { backgroundColor: '#FFF7ED', color: '#EA580C' },
  p3: { backgroundColor: '#F0FDF4', color: '#16A34A' },
  p4: { backgroundColor: '#F4F4F5', color: '#71717A' },
  pna: { backgroundColor: '#F4F4F5', color: '#71717A' },
  
  statusOpen: { backgroundColor: '#DC2626', color: '#FFFFFF' },
  statusProgress: { backgroundColor: '#F97316', color: '#FFFFFF' },
  statusCompleted: { backgroundColor: '#16A34A', color: '#FFFFFF' },
  statusGeneric: { backgroundColor: '#71717A', color: '#FFFFFF' },
  
  issueContentGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  infoColumn: {
    flexGrow: 1,
    flexShrink: 1,
    width: 'auto',
  },
  imageColumn: {
    width: 180,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'flex-end',
  },
  issueImage: {
    width: 85,
    height: 85,
    borderRadius: 8,
    objectFit: 'cover',
    backgroundColor: '#F3F4F6',
  },
  infoGroup: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 10,
    color: '#3f3f46',
    lineHeight: 1.4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 15,
  }
});

interface Issue {
  issueNumber: number;
  location: string;
  responsibleContractor: string;
  description: string;
  measures: string;
  priority: '1' | '2' | '3' | '4' | 'n/a';
  category?: string;
  images: string[];
  status?: string;
  floorPlanId?: string;
  x?: number;
  y?: number;
}

interface FloorPlan {
  id: string;
  name: string;
  url: string;
}

interface InspectionPDFProps {
  data: {
    _id?: string;
    id?: string;
    auftraggeber: string;
    datum: string | Date;
    participantsList: { name: string; role: string }[];
    documentType: string;
    generalNotes?: string[];
    floorPlans: FloorPlan[];
    issues: Issue[];
    parentTitle?: string;
    teilnehmer?: string;
  };
}

export const InspectionPDF = ({ data }: InspectionPDFProps) => {
  // Helper for Cloudinary URLs
  const getFullUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  };

  const fileName = `Inspektionsbericht_${(data.auftraggeber || 'Bericht').replace(/\s+/g, '_')}.pdf`;

  const dateObj = new Date(data.datum);
  const formattedDate = dateObj.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Report Number Logic: YYYY-IDSUFFIX
  const year = dateObj.getFullYear();
  const idSuffix = (data._id || data.id || 'NEW').slice(-6).toUpperCase();
  const reportNumber = `${year}-${idSuffix}`;

  // Force Hide Empty Floor Plans
  const activeFloorPlans = data.floorPlans?.filter(plan => 
    data.issues?.some(issue => issue.floorPlanId === plan.id)
  ) || [];

  return (
    <Document>
      {/* PAGE 1: COVER PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <Text style={styles.headerTitle}>RFS RISK FIRE SAFETY GmbH</Text>
          <Image src="/blacklogo.jpeg" style={styles.logo} />
        </View>

        <View style={styles.coverContainer}>
          <Text style={styles.documentType}>
            {data.documentType === 'Catalog of measures' ? 'Massnahmenkatalog' : 'QS-Protokoll'}
          </Text>
          {data.parentTitle && (
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#DC2626', marginBottom: 15, textTransform: 'uppercase' }}>
              {data.parentTitle}
            </Text>
          )}

          <View style={styles.projectGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Auftraggeber</Text>
              <Text style={styles.value}>{data.auftraggeber}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Datum</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Teilnehmer</Text>
              {Array.isArray(data.participantsList) && data.participantsList.length > 0 ? (
                data.participantsList.map((p, i) => (
                  <Text key={i} style={styles.value}>
                    {p.name} {p.role && p.role.trim() !== '' ? <Text style={{ fontSize: 8, color: '#999999', fontWeight: 'normal' }}>— {p.role.trim()}</Text> : null}
                  </Text>
                ))
              ) : typeof (data as any).participants === 'string' && (data as any).participants ? (
                <Text style={styles.value}>{(data as any).participants}</Text>
              ) : (
                <Text style={styles.value}>-</Text>
              )}
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Erstellt von</Text>
              <Text style={styles.value}>{data.teilnehmer || 'Robin Furrer'}</Text>
            </View>
          </View>

          <View style={styles.reportBadge}>
            <Text style={styles.badgeLabel}>Bericht Nr.</Text>
            <Text style={styles.badgeValue}>#{reportNumber}</Text>
          </View>
        </View>

        {/* Hinweis Section */}
        {data.generalNotes && data.generalNotes.length > 0 && (
          <View>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionLine} />
              <Text>Hinweis</Text>
            </View>
            <View style={styles.notesBox}>
              {data.generalNotes.map((note, idx) => (
                <View key={idx} style={styles.noteItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text>{note}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Priority Legend */}
        <View>
          <View style={styles.sectionTitle}>
            <View style={styles.sectionLine} />
            <Text>Prioritätenlegende</Text>
          </View>
          <View style={styles.legendGrid}>
            <View style={styles.legendCard}>
              <Text style={[styles.levelLabel, { color: '#DC2626' }]}>Stufe 1</Text>
              <Text style={styles.levelText}>Sofortmassnahmen</Text>
            </View>
            <View style={styles.legendCard}>
              <Text style={[styles.levelLabel, { color: '#EA580C' }]}>Stufe 2</Text>
              <Text style={styles.levelText}>Kurzfristig (3 – 6 Monate)</Text>
            </View>
            <View style={styles.legendCard}>
              <Text style={[styles.levelLabel, { color: '#16A34A' }]}>Stufe 3</Text>
              <Text style={styles.levelText}>Mittelfristig (12 – 24 Monate)</Text>
            </View>
            <View style={styles.legendCard}>
              <Text style={[styles.levelLabel, { color: '#71717A' }]}>Stufe 4</Text>
              <Text style={styles.levelText}>Langfristig (2 – 5 Jahre)</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>RFS RISK FIRE SAFETY GmbH</Text>
          <View style={styles.footerAddress}>
            <Text>info@rfs-sicherheit.ch</Text>
          </View>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
        </View>
      </Page>

      {/* PAGES: FLOOR PLAN CONTENT GROUPED */}
      {data.floorPlans?.map((fp) => {
        const fpIssues = data.issues?.filter(i => i.floorPlanId === fp.id) || [];
        if (fpIssues.length === 0) return null;

        return (
          <React.Fragment key={fp.id}>
            {/* Floor Plan Image Page */}
            <Page size="A4" style={styles.page}>
              <View style={styles.headerContainer} fixed>
                <Text style={styles.headerTitle}>RFS RISK FIRE SAFETY GmbH</Text>
                <Image src="/blacklogo.jpeg" style={styles.logo} />
              </View>

              <View style={styles.sectionTitle}>
                <View style={styles.sectionLine} />
                <Text>Grundriss / Brandschutzplan: {fp.name}</Text>
              </View>

              <View style={styles.mapContainer}>
                <Image src={fp.url.replace(/\.pdf$/i, '.jpg')} style={styles.mapImage} />
                {fpIssues.filter(i => i.x !== undefined && i.y !== undefined).map((issue) => (
                  <View 
                    key={issue.issueNumber} 
                    style={[
                      styles.pin, 
                      { 
                        top: `${issue.y}%`, 
                        left: `${issue.x}%`,
                        marginTop: -7,
                        marginLeft: -7
                      }
                    ]}
                  >
                    <Text style={styles.pinText}>{issue.issueNumber}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer} fixed>
                <Text style={styles.footerText}>RFS RISK FIRE SAFETY GmbH</Text>
                <View style={styles.footerAddress}>
                  <Text>info@rfs-sicherheit.ch</Text>
                </View>
                <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
              </View>
            </Page>

            {/* Associated Issues for this Floor Plan */}
            <Page size="A4" style={styles.page}>
              <View style={styles.headerContainer} fixed>
                <Text style={styles.headerTitle}>RFS RISK FIRE SAFETY GmbH</Text>
                <Image src="/blacklogo.jpeg" style={styles.logo} />
              </View>

              <View style={styles.sectionTitle}>
                <View style={styles.sectionLine} />
                <Text>Mängelliste - {fp.name}</Text>
              </View>

              {fpIssues.map((issue, index) => (
                <View key={issue.issueNumber} style={[styles.issueCard]} wrap={false}>
                  <View style={styles.issueHeader}>
                    <View>
                      <Text style={styles.issueNumber}>#{issue.issueNumber}</Text>
                      <Text style={styles.issueLocation}>{issue.location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                      <View style={[
                        styles.priorityBadge, 
                        issue.priority === '1' ? styles.p1 : 
                        issue.priority === '2' ? styles.p2 : 
                        issue.priority === '3' ? styles.p3 : 
                        issue.priority === '4' ? styles.p4 :
                        styles.pna
                      ]}>
                        <Text>{issue.priority === 'n/a' ? 'Priorität n/a' : `Priorität ${issue.priority}`}</Text>
                      </View>
                      <View style={[
                        styles.priorityBadge, 
                        (issue.status === 'Open' || issue.status === 'Offen') ? styles.statusOpen :
                        (issue.status === 'In progress' || issue.status === 'In Bearbeitung') ? styles.statusProgress :
                        (issue.status === 'Completed' || issue.status === 'Erledigt') ? styles.statusCompleted :
                        styles.statusGeneric
                      ]}>
                        <Text>
                          {issue.status === 'Open' ? 'Offen' : 
                           issue.status === 'In progress' ? 'In Bearbeitung' :
                           issue.status === 'Completed' ? 'Erledigt' :
                           issue.status === 'Documentation' ? 'Dokumentation' :
                           issue.status || 'Offen'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.issueContentGrid}>
                    <View style={styles.infoColumn}>
                      {issue.category && (
                        <View style={styles.infoGroup}>
                          <Text style={styles.label}>Kategorie</Text>
                          <Text style={{ fontSize: 9, fontWeight: 'black', textTransform: 'uppercase' }}>{issue.category}</Text>
                        </View>
                      )}
                      <View style={styles.infoGroup}>
                        <Text style={styles.label}>Problembeschreibung</Text>
                        <Text style={styles.descriptionText}>{issue.description}</Text>
                      </View>
                      <View style={styles.infoGroup}>
                        <Text style={styles.label}>Massnahmen</Text>
                        <Text style={[styles.descriptionText, { fontStyle: 'italic' }]}>{issue.measures}</Text>
                      </View>
                      <View style={styles.infoGroup}>
                        <Text style={styles.label}>Verantwortlichkeit</Text>
                        <Text style={{ fontWeight: 'bold' }}>{issue.responsibleContractor}</Text>
                      </View>
                    </View>

                    <View style={styles.imageColumn}>
                      {issue.images?.map((url, i) => (
                        <Image key={i} src={getFullUrl(url)} style={styles.issueImage} />
                      ))}
                    </View>
                  </View>
                  <View style={styles.divider} />
                </View>
              ))}

              <View style={styles.footer} fixed>
                <Text style={styles.footerText}>RFS RISK FIRE SAFETY GmbH</Text>
                <View style={styles.footerAddress}>
                  <Text>info@rfs-sicherheit.ch</Text>
                </View>
                <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
              </View>
            </Page>
          </React.Fragment>
        );
      })}

      {/* PAGE: GENERAL ISSUES (No Floor Plan) */}
      {data.issues.filter(i => !i.floorPlanId).length > 0 && (
        <Page size="A4" style={styles.page}>
          {/* ... Header/Footer omitted for brevity but should be there ... I'll include them in the real replacement */}
          <View style={styles.headerContainer} fixed>
            <Text style={styles.headerTitle}>RFS RISK FIRE SAFETY GmbH</Text>
            <Image src="/blacklogo.jpeg" style={styles.logo} />
          </View>
          <View style={styles.sectionTitle}>
            <View style={styles.sectionLine} />
            <Text>Allgemeine Mängelliste</Text>
          </View>
          {data.issues.filter(i => !i.floorPlanId).map((issue) => (
             <View key={issue.issueNumber} style={[styles.issueCard]} wrap={false}>
               {/* Same issue card structure as above ... */}
               <View style={styles.issueHeader}>
                    <View>
                      <Text style={styles.issueNumber}>#{issue.issueNumber}</Text>
                      <Text style={styles.issueLocation}>{issue.location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                      <View style={[
                        styles.priorityBadge, 
                        issue.priority === '1' ? styles.p1 : 
                        issue.priority === '2' ? styles.p2 : 
                        issue.priority === '3' ? styles.p3 : 
                        issue.priority === '4' ? styles.p4 :
                        styles.pna
                      ]}>
                        <Text>{issue.priority === 'n/a' ? 'Priorität n/a' : `Priorität ${issue.priority}`}</Text>
                      </View>
                      <View style={[
                        styles.priorityBadge, 
                        (issue.status === 'Open' || issue.status === 'Offen') ? styles.statusOpen :
                        (issue.status === 'In progress' || issue.status === 'In Bearbeitung') ? styles.statusProgress :
                        (issue.status === 'Completed' || issue.status === 'Erledigt') ? styles.statusCompleted :
                        styles.statusGeneric
                      ]}>
                        <Text>
                          {issue.status === 'Open' ? 'Offen' : 
                           issue.status === 'In progress' ? 'In Bearbeitung' :
                           issue.status === 'Completed' ? 'Erledigt' :
                           issue.status === 'Documentation' ? 'Dokumentation' :
                           issue.status || 'Offen'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.issueContentGrid}>
                    <View style={styles.infoColumn}>
                      {issue.category && (
                        <View style={styles.infoGroup}>
                          <Text style={styles.label}>Kategorie</Text>
                          <Text style={{ fontSize: 9, fontWeight: 'black', textTransform: 'uppercase' }}>{issue.category}</Text>
                        </View>
                      )}
                      <View style={styles.infoGroup}>
                        <Text style={styles.label}>Problembeschreibung</Text>
                        <Text style={styles.descriptionText}>{issue.description}</Text>
                      </View>
                      <View style={styles.infoGroup}>
                        <Text style={styles.label}>Massnahmen</Text>
                        <Text style={[styles.descriptionText, { fontStyle: 'italic' }]}>{issue.measures}</Text>
                      </View>
                      <View style={styles.infoGroup}>
                        <Text style={styles.label}>Verantwortlichkeit</Text>
                        <Text style={{ fontWeight: 'bold' }}>{issue.responsibleContractor}</Text>
                      </View>
                    </View>
                    <View style={styles.imageColumn}>
                      {issue.images?.map((url, i) => (
                        <Image key={i} src={getFullUrl(url)} style={styles.issueImage} />
                      ))}
                    </View>
                  </View>
             </View>
          ))}
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>RFS RISK FIRE SAFETY GmbH</Text>
            <View style={styles.footerAddress}>
              <Text>info@rfs-sicherheit.ch</Text>
            </View>
            <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber} von ${totalPages}`} />
          </View>
        </Page>
      )}
    </Document>
  );
};
