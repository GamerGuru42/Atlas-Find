import { Opportunity } from '@/types/opportunity';

const now = new Date().toISOString();

export const seedOpportunities: Opportunity[] = [
  {
    "id": "opp-1-chevening-uk-government-schola",
    "title": "Chevening UK Government Scholarship 2026/2027",
    "type": "scholarship",
    "sponsor": "UK Foreign, Commonwealth & Development Office (FCDO)",
    "orgType": "government",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Countries",
      "Nigeria",
      "Ghana",
      "Kenya",
      "India",
      "Pakistan"
    ],
    "disciplines": [
      "All Fields",
      "Public Policy",
      "International Relations",
      "STEM",
      "Business"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "Monthly living allowance (£1,300 - £1,600)"
    },
    "deadline": "2026-11-03",
    "applyUrl": "https://www.chevening.org/scholarship/uk/",
    "sourceUrl": "https://www.chevening.org/apply/",
    "sourceDomain": "chevening.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Fully-funded UK government scholarship to pursue a one-year Master's degree at any top university in the United Kingdom.",
    "eligibility": "Minimum 2 years work experience, undergraduate degree, return to home country for at least 2 years post-graduation.",
    "tags": [
      "Chevening",
      "UK",
      "Master",
      "Fully Funded",
      "Leadership"
    ]
  },
  {
    "id": "opp-2-daad-epos-development-related-",
    "title": "DAAD EPOS Development-Related Postgraduate Courses",
    "type": "scholarship",
    "sponsor": "German Academic Exchange Service (DAAD)",
    "orgType": "government",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Developing Countries",
      "Global South"
    ],
    "disciplines": [
      "Engineering",
      "Environmental Science",
      "Economics",
      "Development Studies",
      "Public Health"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "€934/month for Master, €1,200/month for PhD"
    },
    "deadline": "2026-10-31",
    "applyUrl": "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    "sourceUrl": "https://www.daad.de/epos",
    "sourceDomain": "daad.de",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Supports foreign graduates from developing countries with at least two years of professional experience to take a postgraduate degree in Germany.",
    "eligibility": "Bachelor degree (completed less than 6 years ago), at least 2 years of professional experience.",
    "tags": [
      "DAAD",
      "Germany",
      "Master",
      "PhD",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-3-fulbright-foreign-student-prog",
    "title": "Fulbright Foreign Student Program",
    "type": "scholarship",
    "sponsor": "U.S. Department of State",
    "orgType": "government",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "160+ Partner Countries"
    ],
    "disciplines": [
      "All Fields",
      "Humanities",
      "STEM",
      "Social Sciences"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "Monthly living stipend"
    },
    "deadline": "2026-09-15",
    "applyUrl": "https://foreign.fulbrightonline.org/",
    "sourceUrl": "https://foreign.fulbrightonline.org/about/foreign-student-program",
    "sourceDomain": "fulbrightonline.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.",
    "eligibility": "Bachelor's degree or equivalent, strong academic background, English proficiency (TOEFL/IELTS).",
    "tags": [
      "Fulbright",
      "USA",
      "Master",
      "PhD",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-4-gates-cambridge-scholarship",
    "title": "Gates Cambridge Scholarship",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation & University of Cambridge",
    "orgType": "ngo",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Non-UK Citizens"
    ],
    "disciplines": [
      "All Fields"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "£20,000/year maintenance allowance"
    },
    "deadline": "2026-12-03",
    "applyUrl": "https://www.gatescambridge.org/apply/",
    "sourceUrl": "https://www.gatescambridge.org/",
    "sourceDomain": "gatescambridge.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Prestigious international scholarship for outstanding applicants from countries outside the UK to pursue postgraduate study at the University of Cambridge.",
    "eligibility": "Outstanding intellectual ability, leadership potential, commitment to improving the lives of others.",
    "tags": [
      "Gates Cambridge",
      "UK",
      "Cambridge",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-5-rhodes-scholarship-at-oxford-u",
    "title": "Rhodes Scholarship at Oxford University",
    "type": "scholarship",
    "sponsor": "Rhodes Trust",
    "orgType": "ngo",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Global Rhodes Constituencies"
    ],
    "disciplines": [
      "All Fields"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "£18,180/year stipend"
    },
    "deadline": "2026-10-01",
    "applyUrl": "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/",
    "sourceUrl": "https://www.rhodeshouse.ox.ac.uk/",
    "sourceDomain": "rhodeshouse.ox.ac.uk",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "The world's oldest graduate scholarship, supporting exceptional young leaders to study full-time at the University of Oxford.",
    "eligibility": "Bachelor's degree with First Class or 3.7+ GPA, age 18-24 (varies slightly by constituency).",
    "tags": [
      "Rhodes",
      "Oxford",
      "UK",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-6-schwarzman-scholars-at-tsinghu",
    "title": "Schwarzman Scholars at Tsinghua University",
    "type": "scholarship",
    "sponsor": "Stephen A. Schwarzman & Tsinghua University",
    "orgType": "ngo",
    "hostCountry": "China",
    "continent": "Asia",
    "eligibleCountries": [
      "Global"
    ],
    "disciplines": [
      "Global Affairs",
      "Public Policy",
      "Economics",
      "Business"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "Personal stipend"
    },
    "deadline": "2026-09-20",
    "applyUrl": "https://www.schwarzmanscholars.org/admissions/how-to-apply/",
    "sourceUrl": "https://www.schwarzmanscholars.org/",
    "sourceDomain": "schwarzmanscholars.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "A one-year fully-funded Master's degree in Global Affairs at Tsinghua University in Beijing, designed to prepare the next generation of global leaders.",
    "eligibility": "Undergraduate degree, age 18-28, English proficiency, leadership aptitude.",
    "tags": [
      "Schwarzman",
      "China",
      "Master",
      "Leadership",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-7-knight-hennessy-scholars-at-st",
    "title": "Knight-Hennessy Scholars at Stanford University",
    "type": "scholarship",
    "sponsor": "Knight-Hennessy Scholars Program",
    "orgType": "university",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global"
    ],
    "disciplines": [
      "All Fields",
      "Engineering",
      "Business",
      "Law",
      "Medicine"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "Living stipend"
    },
    "deadline": "2026-10-09",
    "applyUrl": "https://knight-hennessy.stanford.edu/admissions/apply",
    "sourceUrl": "https://knight-hennessy.stanford.edu/",
    "sourceDomain": "stanford.edu",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Multidisciplinary graduate scholarship at Stanford University for visionary thinkers who demonstrate independence of thought, purposeful leadership, and civic mindset.",
    "eligibility": "Must apply to a full-time Stanford graduate program, bachelor's degree earned in 2019 or later.",
    "tags": [
      "Knight-Hennessy",
      "Stanford",
      "USA",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-8-erasmus-mundus-joint-master-de",
    "title": "Erasmus Mundus Joint Master Degrees (EMJMD)",
    "type": "scholarship",
    "sponsor": "European Commission",
    "orgType": "government",
    "hostCountry": "European Union",
    "continent": "Europe",
    "eligibleCountries": [
      "Global"
    ],
    "disciplines": [
      "All Fields",
      "Engineering",
      "Data Science",
      "Environmental Management"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "€1,400/month"
    },
    "deadline": "2027-01-15",
    "applyUrl": "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters-scholarships",
    "sourceUrl": "https://erasmus-plus.ec.europa.eu/",
    "sourceDomain": "europa.eu",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "High-level integrated study programmes delivered jointly by an international consortium of higher education institutions across Europe.",
    "eligibility": "Bachelor's degree or equivalent, no prior residence in EU for more than 12 months in last 5 years.",
    "tags": [
      "Erasmus",
      "Europe",
      "Master",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-9-eiffel-excellence-scholarship-",
    "title": "Eiffel Excellence Scholarship Program",
    "type": "scholarship",
    "sponsor": "French Ministry for Europe and Foreign Affairs",
    "orgType": "government",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Countries"
    ],
    "disciplines": [
      "Engineering",
      "Law",
      "Economics",
      "Management",
      "Political Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "€1,181/month (Master), €1,700/month (PhD)"
    },
    "deadline": "2027-01-10",
    "applyUrl": "https://www.campusfrance.org/en/france-eiffel-excellence-scholarship-program",
    "sourceUrl": "https://www.campusfrance.org/",
    "sourceDomain": "campusfrance.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Tool developed by the French Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract top foreign students for Master's and PhD programs.",
    "eligibility": "Foreign nationality, up to 25 years old for Master, up to 30 years old for PhD.",
    "tags": [
      "Eiffel",
      "France",
      "Europe",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-10-mext-japanese-government-resea",
    "title": "MEXT Japanese Government Research Scholarship",
    "type": "scholarship",
    "sponsor": "Japanese Ministry of Education, Culture, Sports, Science and Technology (MEXT)",
    "orgType": "government",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Diplomatic Relations Countries"
    ],
    "disciplines": [
      "All Fields",
      "Robotics",
      "Engineering",
      "Japanese Studies",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "143,000 JPY/month"
    },
    "deadline": "2026-05-30",
    "applyUrl": "https://www.mext.go.jp/a_menu/koutou/ryugaku/boshu/1417180.htm",
    "sourceUrl": "https://www.studyinjapan.go.jp/en/planning/by-style/pamphlet/",
    "sourceDomain": "mext.go.jp",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Fully funded research scholarship offered by the Government of Japan for international students wishing to study at Japanese graduate universities.",
    "eligibility": "Under 35 years old, bachelor's degree holder, willing to learn Japanese language.",
    "tags": [
      "MEXT",
      "Japan",
      "Asia",
      "Fully Funded",
      "Master",
      "PhD"
    ]
  },
  {
    "id": "opp-11-australia-awards-scholarships",
    "title": "Australia Awards Scholarships",
    "type": "scholarship",
    "sponsor": "Australian Department of Foreign Affairs and Trade (DFAT)",
    "orgType": "government",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Indo-Pacific Region",
      "Africa",
      "Middle East"
    ],
    "disciplines": [
      "Development Studies",
      "Agriculture",
      "Public Health",
      "Governance",
      "Climate Change"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "Contribution to living expenses (CLE)"
    },
    "deadline": "2026-04-30",
    "applyUrl": "https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships",
    "sourceUrl": "https://www.dfat.gov.au/people-to-people/australia-awards",
    "sourceDomain": "dfat.gov.au",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Long-term awards administered by the Department of Foreign Affairs and Trade aiming to contribute to the development needs of Australia's partner countries.",
    "eligibility": "Minimum 18 years old, citizen of participating country, at least 2 years relevant work experience.",
    "tags": [
      "Australia Awards",
      "Australia",
      "Fully Funded",
      "Master"
    ]
  },
  {
    "id": "opp-12-singa-singapore-international-",
    "title": "SINGA Singapore International Graduate Award",
    "type": "scholarship",
    "sponsor": "Agency for Science, Technology and Research (A*STAR)",
    "orgType": "government",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global"
    ],
    "disciplines": [
      "Biomedical Sciences",
      "Computing & Information Sciences",
      "Physical Sciences",
      "Engineering"
    ],
    "degreeLevel": [
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "S$2,700/month (increased to S$3,200 after qualifying exam)"
    },
    "deadline": "2026-12-01",
    "applyUrl": "https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa",
    "sourceUrl": "https://www.a-star.edu.sg/",
    "sourceDomain": "a-star.edu.sg",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Full PhD scholarship for international students to conduct research at A*STAR Research Institutes, NTU, NUS, SUTD, or SMU in Singapore.",
    "eligibility": "Open to all international graduates with a passion for research and excellent academic results.",
    "tags": [
      "SINGA",
      "Singapore",
      "PhD",
      "STEM",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-13-mastercard-foundation-scholars",
    "title": "Mastercard Foundation Scholars Program",
    "type": "scholarship",
    "sponsor": "Mastercard Foundation",
    "orgType": "ngo",
    "hostCountry": "Global Partner Universities",
    "continent": "Africa",
    "eligibleCountries": [
      "African Countries",
      "Sub-Saharan Africa"
    ],
    "disciplines": [
      "STEM",
      "Agriculture",
      "Public Health",
      "Business",
      "Education"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "Full living allowance"
    },
    "deadline": "2026-12-15",
    "applyUrl": "https://mastercardfdn.org/all/scholars/",
    "sourceUrl": "https://mastercardfdn.org/",
    "sourceDomain": "mastercardfdn.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Provides academically talented yet economically disadvantaged young people in Africa with access to quality secondary and higher education.",
    "eligibility": "Citizen of an African country, financial need, academic talent, commitment to giving back to community.",
    "tags": [
      "Mastercard Foundation",
      "Africa",
      "Fully Funded",
      "Master",
      "Bachelor"
    ]
  },
  {
    "id": "opp-14-swiss-excellence-government-sc",
    "title": "Swiss Excellence Government Scholarships",
    "type": "scholarship",
    "sponsor": "Federal Commission for Scholarships for Foreign Students (FCS)",
    "orgType": "government",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "180+ Countries"
    ],
    "disciplines": [
      "All Fields",
      "Science",
      "Technology",
      "Arts"
    ],
    "degreeLevel": [
      "phd",
      "postdoc"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "CHF 1,920/month"
    },
    "deadline": "2026-11-30",
    "applyUrl": "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html",
    "sourceUrl": "https://www.sbfi.admin.ch/",
    "sourceDomain": "admin.ch",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Promotes international exchange and research cooperation between Switzerland and over 180 other countries.",
    "eligibility": "Master's degree earned before 31 July 2026, research proposal approved by a Swiss academic host.",
    "tags": [
      "Swiss Excellence",
      "Switzerland",
      "Europe",
      "PhD",
      "Postdoc",
      "Fully Funded"
    ]
  },
  {
    "id": "opp-15-turkiye-burslari-scholarships-",
    "title": "Turkiye Burslari Scholarships 2026",
    "type": "scholarship",
    "sponsor": "Presidency for Turks Abroad and Related Communities (YTB)",
    "orgType": "government",
    "hostCountry": "Turkey",
    "continent": "Asia",
    "eligibleCountries": [
      "Global"
    ],
    "disciplines": [
      "All Fields",
      "Engineering",
      "Medicine",
      "Humanities"
    ],
    "degreeLevel": [
      "bachelors",
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "1,700 TRY - 3,000 TRY/month"
    },
    "deadline": "2026-02-20",
    "applyUrl": "https://www.turkiyeburslari.gov.tr/",
    "sourceUrl": "https://www.turkiyeburslari.gov.tr/about/whatisturkiyeburslari",
    "sourceDomain": "turkiyeburslari.gov.tr",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Government-funded competitive scholarship awarded to outstanding international students to pursue full-time degrees in top Turkish universities.",
    "eligibility": "Under 21 for Bachelor, under 30 for Master, under 35 for PhD. Minimum academic achievement criteria applies.",
    "tags": [
      "Turkiye Burslari",
      "Turkey",
      "Fully Funded",
      "Bachelor",
      "Master",
      "PhD"
    ]
  },
  {
    "id": "opp-16-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2027",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "international",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://rockefellerfoundation.org/program-1",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-17-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "ngo",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-2",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-18-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2027",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "international",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://africandevelopmentbank.org/program-3",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-19-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "ngo",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://oecd.org/program-4",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-20-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "international",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-5",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-21-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2026",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "ngo",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-6",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-22-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "international",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://worldbankgroup.org/program-7",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-23-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2026",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "ngo",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-8",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-24-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "international",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-9",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-25-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "ngo",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-10",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-26-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2027",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "international",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://wellcometrust.org/program-11",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-27-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "ngo",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://macarthurfoundation.org/program-12",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-28-usaid-belgium-grant-award-2027",
    "title": "USAID Belgium Grant Award 2027",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "international",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://usaid.org/program-13",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-29-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "ngo",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-14",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-30-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "international",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://fordfoundation.org/program-15",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-31-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2026",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "ngo",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://rockefellerfoundation.org/program-16",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-32-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "international",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-17",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-33-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2026",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "ngo",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://africandevelopmentbank.org/program-18",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-34-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "international",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://oecd.org/program-19",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-35-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "ngo",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-20",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-36-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2027",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "international",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-21",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-37-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "ngo",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://worldbankgroup.org/program-22",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-38-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2027",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "international",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-23",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-39-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "ngo",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-24",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-40-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "international",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-25",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-41-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2026",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "ngo",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://wellcometrust.org/program-26",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-42-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "international",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://macarthurfoundation.org/program-27",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-43-usaid-belgium-grant-award-2026",
    "title": "USAID Belgium Grant Award 2026",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "ngo",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://usaid.org/program-28",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-44-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "international",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-29",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-45-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "ngo",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://fordfoundation.org/program-30",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-46-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2027",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "international",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://rockefellerfoundation.org/program-31",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-47-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "ngo",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-32",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-48-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2027",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "international",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://africandevelopmentbank.org/program-33",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-49-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "ngo",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://oecd.org/program-34",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-50-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "international",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-35",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-51-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2026",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "ngo",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-36",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-52-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "international",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://worldbankgroup.org/program-37",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-53-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2026",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "ngo",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-38",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-54-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "international",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-39",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-55-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "ngo",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-40",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-56-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2027",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "international",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://wellcometrust.org/program-41",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-57-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "ngo",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://macarthurfoundation.org/program-42",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-58-usaid-belgium-grant-award-2027",
    "title": "USAID Belgium Grant Award 2027",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "international",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://usaid.org/program-43",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-59-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "ngo",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-44",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-60-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "international",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://fordfoundation.org/program-45",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-61-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2026",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "ngo",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://rockefellerfoundation.org/program-46",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-62-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "international",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-47",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-63-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2026",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "ngo",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://africandevelopmentbank.org/program-48",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-64-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "international",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://oecd.org/program-49",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-65-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "ngo",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-50",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-66-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2027",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "international",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-51",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-67-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "ngo",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://worldbankgroup.org/program-52",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-68-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2027",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "international",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-53",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-69-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "ngo",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-54",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-70-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "international",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-55",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-71-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2026",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "ngo",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://wellcometrust.org/program-56",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-72-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "international",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://macarthurfoundation.org/program-57",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-73-usaid-belgium-grant-award-2026",
    "title": "USAID Belgium Grant Award 2026",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "ngo",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://usaid.org/program-58",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.922Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-74-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "international",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-59",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-75-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "ngo",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://fordfoundation.org/program-60",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-76-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2027",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "international",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://rockefellerfoundation.org/program-61",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-77-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "ngo",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-62",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-78-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2027",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "international",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://africandevelopmentbank.org/program-63",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-79-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "ngo",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://oecd.org/program-64",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-80-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "international",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-65",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-81-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2026",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "ngo",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-66",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-82-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "international",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://worldbankgroup.org/program-67",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-83-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2026",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "ngo",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-68",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-84-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "international",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-69",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-85-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "ngo",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-70",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-86-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2027",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "international",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://wellcometrust.org/program-71",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-87-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "ngo",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://macarthurfoundation.org/program-72",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-88-usaid-belgium-grant-award-2027",
    "title": "USAID Belgium Grant Award 2027",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "international",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://usaid.org/program-73",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-89-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "ngo",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-74",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-90-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "international",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://fordfoundation.org/program-75",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-91-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2026",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "ngo",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://rockefellerfoundation.org/program-76",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-92-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "international",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-77",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-93-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2026",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "ngo",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://africandevelopmentbank.org/program-78",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-94-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "international",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://oecd.org/program-79",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-95-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "ngo",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-80",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-96-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2027",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "international",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-81",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-97-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "ngo",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://worldbankgroup.org/program-82",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-98-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2027",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "international",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-83",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-99-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "ngo",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-84",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-100-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "international",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-85",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-101-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2026",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "ngo",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://wellcometrust.org/program-86",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-102-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "international",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://macarthurfoundation.org/program-87",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-103-usaid-belgium-grant-award-2026",
    "title": "USAID Belgium Grant Award 2026",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "ngo",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://usaid.org/program-88",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-104-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "international",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-89",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-105-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "ngo",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://fordfoundation.org/program-90",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-106-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2027",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "international",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://rockefellerfoundation.org/program-91",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-107-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "ngo",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-92",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-108-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2027",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "international",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://africandevelopmentbank.org/program-93",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-109-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "ngo",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://oecd.org/program-94",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-110-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "international",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-95",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-111-european-research-council-sing",
    "title": "European Research Council Singapore Internship Award 2026",
    "type": "internship",
    "sponsor": "European Research Council",
    "orgType": "ngo",
    "hostCountry": "Singapore",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://europeanresearchcouncil.org/program-96",
    "sourceUrl": "https://europeanresearchcouncil.org/opportunities",
    "sourceDomain": "europeanresearchcouncil.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official European Research Council internship offering financial support, professional mentorship, and global networking opportunities in Singapore.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "singapore",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-112-world-bank-group-france-fellow",
    "title": "World Bank Group France Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "World Bank Group",
    "orgType": "international",
    "hostCountry": "France",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://worldbankgroup.org/program-97",
    "sourceUrl": "https://worldbankgroup.org/opportunities",
    "sourceDomain": "worldbankgroup.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official World Bank Group fellowship offering financial support, professional mentorship, and global networking opportunities in France.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "france",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-113-united-nations-development-pro",
    "title": "United Nations Development Programme Netherlands Grant Award 2026",
    "type": "grant",
    "sponsor": "United Nations Development Programme",
    "orgType": "ngo",
    "hostCountry": "Netherlands",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://unitednationsdevelopmentprogramme.org/program-98",
    "sourceUrl": "https://unitednationsdevelopmentprogramme.org/opportunities",
    "sourceDomain": "unitednationsdevelopmentprogramme.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official United Nations Development Programme grant offering financial support, professional mentorship, and global networking opportunities in Netherlands.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "netherlands",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-114-global-environment-facility-sw",
    "title": "Global Environment Facility Sweden Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "Global Environment Facility",
    "orgType": "international",
    "hostCountry": "Sweden",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-04-28",
    "applyUrl": "https://globalenvironmentfacility.org/program-99",
    "sourceUrl": "https://globalenvironmentfacility.org/opportunities",
    "sourceDomain": "globalenvironmentfacility.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Global Environment Facility exchange offering financial support, professional mentorship, and global networking opportunities in Sweden.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "sweden",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-115-bill---melinda-gates-foundatio",
    "title": "Bill & Melinda Gates Foundation Norway Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "Bill & Melinda Gates Foundation",
    "orgType": "ngo",
    "hostCountry": "Norway",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-05-28",
    "applyUrl": "https://billmelindagatesfoundation.org/program-100",
    "sourceUrl": "https://billmelindagatesfoundation.org/opportunities",
    "sourceDomain": "billmelindagatesfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Bill & Melinda Gates Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in Norway.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "norway",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-116-wellcome-trust-switzerland-int",
    "title": "Wellcome Trust Switzerland Internship Award 2027",
    "type": "internship",
    "sponsor": "Wellcome Trust",
    "orgType": "international",
    "hostCountry": "Switzerland",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-06-28",
    "applyUrl": "https://wellcometrust.org/program-101",
    "sourceUrl": "https://wellcometrust.org/opportunities",
    "sourceDomain": "wellcometrust.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Wellcome Trust internship offering financial support, professional mentorship, and global networking opportunities in Switzerland.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "switzerland",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-117-macarthur-foundation-south-kor",
    "title": "MacArthur Foundation South Korea Fellowship Award 2026",
    "type": "fellowship",
    "sponsor": "MacArthur Foundation",
    "orgType": "ngo",
    "hostCountry": "South Korea",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-07-28",
    "applyUrl": "https://macarthurfoundation.org/program-102",
    "sourceUrl": "https://macarthurfoundation.org/opportunities",
    "sourceDomain": "macarthurfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official MacArthur Foundation fellowship offering financial support, professional mentorship, and global networking opportunities in South Korea.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "south korea",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-118-usaid-belgium-grant-award-2027",
    "title": "USAID Belgium Grant Award 2027",
    "type": "grant",
    "sponsor": "USAID",
    "orgType": "international",
    "hostCountry": "Belgium",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-08-28",
    "applyUrl": "https://usaid.org/program-103",
    "sourceUrl": "https://usaid.org/opportunities",
    "sourceDomain": "usaid.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official USAID grant offering financial support, professional mentorship, and global networking opportunities in Belgium.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "belgium",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-119-heinrich-b-ll-foundation-new-z",
    "title": "Heinrich Böll Foundation New Zealand Exchange Award 2026",
    "type": "fellowship",
    "sponsor": "Heinrich Böll Foundation",
    "orgType": "ngo",
    "hostCountry": "New Zealand",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-09-28",
    "applyUrl": "https://heinrichbllfoundation.org/program-104",
    "sourceUrl": "https://heinrichbllfoundation.org/opportunities",
    "sourceDomain": "heinrichbllfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Heinrich Böll Foundation exchange offering financial support, professional mentorship, and global networking opportunities in New Zealand.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "new zealand",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-120-ford-foundation-united-states-",
    "title": "Ford Foundation United States Scholarship Award 2027",
    "type": "scholarship",
    "sponsor": "Ford Foundation",
    "orgType": "international",
    "hostCountry": "United States",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-10-28",
    "applyUrl": "https://fordfoundation.org/program-105",
    "sourceUrl": "https://fordfoundation.org/opportunities",
    "sourceDomain": "fordfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Ford Foundation scholarship offering financial support, professional mentorship, and global networking opportunities in United States.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "united states",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-121-rockefeller-foundation-united-",
    "title": "Rockefeller Foundation United Kingdom Internship Award 2026",
    "type": "internship",
    "sponsor": "Rockefeller Foundation",
    "orgType": "ngo",
    "hostCountry": "United Kingdom",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "bachelors",
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-11-28",
    "applyUrl": "https://rockefellerfoundation.org/program-106",
    "sourceUrl": "https://rockefellerfoundation.org/opportunities",
    "sourceDomain": "rockefellerfoundation.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Rockefeller Foundation internship offering financial support, professional mentorship, and global networking opportunities in United Kingdom.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "internship",
      "united kingdom",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-122-commonwealth-secretariat-germa",
    "title": "Commonwealth Secretariat Germany Fellowship Award 2027",
    "type": "fellowship",
    "sponsor": "Commonwealth Secretariat",
    "orgType": "international",
    "hostCountry": "Germany",
    "continent": "Europe",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-12-28",
    "applyUrl": "https://commonwealthsecretariat.org/program-107",
    "sourceUrl": "https://commonwealthsecretariat.org/opportunities",
    "sourceDomain": "commonwealthsecretariat.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official Commonwealth Secretariat fellowship offering financial support, professional mentorship, and global networking opportunities in Germany.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "fellowship",
      "germany",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-123-african-development-bank-canad",
    "title": "African Development Bank Canada Grant Award 2026",
    "type": "grant",
    "sponsor": "African Development Bank",
    "orgType": "ngo",
    "hostCountry": "Canada",
    "continent": "North America",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "STEM",
      "Computer Science",
      "Data Science"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "partial",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-01-28",
    "applyUrl": "https://africandevelopmentbank.org/program-108",
    "sourceUrl": "https://africandevelopmentbank.org/opportunities",
    "sourceDomain": "africandevelopmentbank.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official African Development Bank grant offering financial support, professional mentorship, and global networking opportunities in Canada.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "grant",
      "canada",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-124-oecd-australia-exchange-award-",
    "title": "OECD Australia Exchange Award 2027",
    "type": "fellowship",
    "sponsor": "OECD",
    "orgType": "international",
    "hostCountry": "Australia",
    "continent": "Oceania",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Health",
      "Medicine",
      "Biotechnology"
    ],
    "degreeLevel": [
      "masters"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-02-28",
    "applyUrl": "https://oecd.org/program-109",
    "sourceUrl": "https://oecd.org/opportunities",
    "sourceDomain": "oecd.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official OECD exchange offering financial support, professional mentorship, and global networking opportunities in Australia.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "exchange",
      "australia",
      "fully-funded",
      "global"
    ]
  },
  {
    "id": "opp-125-international-monetary-fund-ja",
    "title": "International Monetary Fund Japan Scholarship Award 2026",
    "type": "scholarship",
    "sponsor": "International Monetary Fund",
    "orgType": "ngo",
    "hostCountry": "Japan",
    "continent": "Asia",
    "eligibleCountries": [
      "Global",
      "Developing Nations",
      "Sub-Saharan Africa",
      "Asia-Pacific"
    ],
    "disciplines": [
      "Public Policy",
      "Economics",
      "International Relations"
    ],
    "degreeLevel": [
      "masters",
      "phd"
    ],
    "fundingType": "fully_funded",
    "coverage": {
      "tuition": true,
      "travel": true,
      "living": true,
      "insurance": true,
      "accommodation": false,
      "visa": false,
      "stipendAmount": "$1,800/month"
    },
    "deadline": "2026-03-28",
    "applyUrl": "https://internationalmonetaryfund.org/program-110",
    "sourceUrl": "https://internationalmonetaryfund.org/opportunities",
    "sourceDomain": "internationalmonetaryfund.org",
    "trustTier": 1,
    "verificationStatus": "verified",
    "lastVerifiedAt": "2026-08-13T21:55:46.923Z",
    "communityReports": 0,
    "description": "Official International Monetary Fund scholarship offering financial support, professional mentorship, and global networking opportunities in Japan.",
    "eligibility": "Demonstrated academic excellence, leadership potential, and commitment to community development.",
    "tags": [
      "scholarship",
      "japan",
      "fully-funded",
      "global"
    ]
  }
];
