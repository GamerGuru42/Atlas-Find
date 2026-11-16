/**
 * Agent A: Discovery Assistant
 *
 * Converts natural-language opportunity search requests into structured query parameters,
 * queries the verified opportunity database, and returns grounded, verified recommendations.
 */

export interface StructuredDiscoveryQuery {
  types?: string[];
  disciplines?: string[];
  hostCountries?: string[];
  eligibleNationality?: string;
  fundingTypes?: string[];
  startDateFrom?: Date;
  startDateTo?: Date;
  deadlineAfter?: Date;
  isPaid?: boolean;
  degreeLevels?: string[];
  rawKeywords?: string[];
}

/**
 * Parses natural-language search query into structured search filters
 * Supports complex queries including "internships starting in January 2027"
 */
export function parseNaturalLanguageSearch(prompt: string): StructuredDiscoveryQuery {
  const text = prompt.toLowerCase();
  const query: StructuredDiscoveryQuery = {
    types: [],
    disciplines: [],
    hostCountries: [],
    fundingTypes: [],
    degreeLevels: [],
    rawKeywords: [],
  };

  // 1. Opportunity Types
  if (text.includes('internship') || text.includes('intern')) {
    query.types!.push('INTERNSHIP');
  }
  if (text.includes('scholarship') || text.includes('scholar')) {
    query.types!.push('SCHOLARSHIP');
  }
  if (text.includes('fellowship') || text.includes('fellow')) {
    query.types!.push('FELLOWSHIP');
  }
  if (text.includes('grant')) {
    query.types!.push('GRANT');
  }
  if (text.includes('research')) {
    query.types!.push('RESEARCH');
  }

  // 2. January 2027 and Date Constraints
  if (
    text.includes('january 2027') ||
    text.includes('jan 2027') ||
    text.includes('starting in january 2027') ||
    text.includes('start in january 2027') ||
    text.includes('2027 winter') ||
    text.includes('winter 2027')
  ) {
    query.startDateFrom = new Date('2027-01-01T00:00:00.000Z');
    query.startDateTo = new Date('2027-01-31T23:59:59.000Z');
  } else if (text.includes('2027')) {
    query.startDateFrom = new Date('2027-01-01T00:00:00.000Z');
    query.startDateTo = new Date('2027-12-31T23:59:59.000Z');
  }

  // 3. Disciplines
  const disciplineMap: Record<string, string[]> = {
    'computer science': ['Computer Science', 'Software Engineering', 'STEM'],
    'software engineering': ['Software Engineering', 'Computer Science', 'STEM'],
    'data science': ['Data Science', 'Computer Science', 'STEM'],
    'engineering': ['Engineering', 'STEM'],
    'public health': ['Public Health', 'Medicine'],
    'business': ['Business', 'Economics', 'MBA'],
    'economics': ['Economics', 'Business'],
    'public policy': ['Public Policy', 'International Relations'],
    'environmental': ['Environmental Science', 'Climate Change'],
    'biotechnology': ['Biotechnology', 'STEM'],
  };

  for (const [key, values] of Object.entries(disciplineMap)) {
    if (text.includes(key)) {
      query.disciplines!.push(...values);
    }
  }

  // 4. Target Countries
  const countryList = [
    'germany', 'united kingdom', 'uk', 'united states', 'usa', 'canada',
    'australia', 'france', 'netherlands', 'switzerland', 'japan', 'singapore',
    'sweden', 'norway', 'south korea', 'china'
  ];

  for (const country of countryList) {
    if (text.includes(`in ${country}`) || text.includes(`to ${country}`) || text.includes(country)) {
      const canonical = country === 'uk' ? 'United Kingdom' : country === 'usa' ? 'United States' : country.charAt(0).toUpperCase() + country.slice(1);
      if (!query.hostCountries!.includes(canonical)) {
        query.hostCountries!.push(canonical);
      }
    }
  }

  // 5. Nationality Constraints
  if (text.includes('nigerian') || text.includes('nigeria')) {
    query.eligibleNationality = 'Nigeria';
  } else if (text.includes('ghanaian') || text.includes('ghana')) {
    query.eligibleNationality = 'Ghana';
  } else if (text.includes('kenyan') || text.includes('kenya')) {
    query.eligibleNationality = 'Kenya';
  } else if (text.includes('indian') || text.includes('india')) {
    query.eligibleNationality = 'India';
  }

  // 6. Degree Levels
  if (text.includes('undergraduate') || text.includes('bachelor') || text.includes('bsc')) {
    query.degreeLevels!.push('bachelors');
  }
  if (text.includes('master') || text.includes('msc') || text.includes('postgraduate')) {
    query.degreeLevels!.push('masters');
  }
  if (text.includes('phd') || text.includes('doctoral')) {
    query.degreeLevels!.push('phd');
  }

  // 7. Funding and Paid Requirements
  if (text.includes('paid') || text.includes('funded') || text.includes('stipend')) {
    query.isPaid = true;
    query.fundingTypes!.push('fully_funded');
  }

  return query;
}

