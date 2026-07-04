/**
 * Yaba College of Technology — full department / school list
 * Used across: auth/register, events registration form
 */
export const YABATECH_DEPARTMENTS = [
  // School of Engineering Technology
  "Chemical Engineering Technology",
  "Civil Engineering Technology",
  "Computer Engineering Technology",
  "Electrical Engineering Technology",
  "Electronic & Communications Engineering",
  "Mechanical Engineering Technology",
  "Mechatronics Engineering Technology",
  "Metallurgical Engineering Technology",
  // School of Applied Sciences
  "Biochemistry",
  "Biology",
  "Chemistry",
  "Computer Science",
  "Food Technology",
  "Mathematical Sciences / Statistics",
  "Microbiology",
  "Physics / Electronics",
  "Science Laboratory Technology",
  // School of Management & Business Studies
  "Accountancy",
  "Banking & Finance",
  "Business Administration & Management",
  "Insurance",
  "Marketing",
  "Office Technology & Management",
  "Public Administration",
  // School of Technology
  "Agricultural Technology",
  "Architectural Technology",
  "Building Technology",
  "Estate Management & Valuation",
  "Printing Technology",
  "Quantity Surveying",
  "Surveying & Geo-Informatics",
  "Urban & Regional Planning",
  // School of Liberal Studies
  "Library & Information Science",
  "Mass Communication",
  // School of Art, Design & Printing
  "Art & Design",
  "Graphic Arts & Design",
  "Industrial Design",
  "Photography",
  // School of Environmental Studies
  "Environmental Biology",
  // Vocational & Technical Programmes
  "Catering & Hotel Management",
  "Fashion Design & Clothing Technology",
  "Hospitality Management",
  "Leisure & Tourism",
  "Nutrition & Dietetics",
  // Other
  "Other / Not Listed",
] as const;

export type YabatechDepartment = (typeof YABATECH_DEPARTMENTS)[number];
