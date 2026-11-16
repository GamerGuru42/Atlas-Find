import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth/adminAuth';

export async function GET(request: Request) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  const sources = [
    { name: "Chevening", url: "https://www.chevening.org/scholarships/", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "DAAD", url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "Fulbright", url: "https://foreign.fulbrightonline.org/", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "World Bank", url: "https://www.worldbank.org/en/about/careers/programs-and-internships/internship", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "European Space Agency", url: "https://www.esa.int/About_Us/Careers_at_ESA/Student_Internships", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "CERN", url: "https://careers.cern/students", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "Google Students", url: "https://careers.google.com/students/", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "Mastercard Foundation", url: "https://mastercardfdn.org/all/scholars/", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "Erasmus Mundus", url: "https://erasmus-plus.ec.europa.eu/", active: true, trustTier: 1, lastRun: new Date().toISOString() },
    { name: "Swiss Government Excellence", url: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html", active: true, trustTier: 1, lastRun: new Date().toISOString() }
  ];

  return NextResponse.json({ sources });
}
