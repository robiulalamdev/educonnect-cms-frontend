// Worldwide static location data — Country → States → Cities
// No Google API needed. Expand as needed.

export interface StateData {
  name: string;
  cities: string[];
}

export interface CountryData {
  code: string;
  name: string;
  states: StateData[];
}

export const LOCATIONS: CountryData[] = [
  {
    code: "BD", name: "Bangladesh", states: [
      { name: "Dhaka Division", cities: ["Dhaka", "Gazipur", "Narayanganj", "Mymensingh", "Tangail", "Kishoreganj", "Manikganj", "Munshiganj", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur"] },
      { name: "Chittagong Division", cities: ["Chittagong", "Cox's Bazar", "Comilla", "Brahmanbaria", "Chandpur", "Lakshmipur", "Noakhali", "Feni", "Khagrachhari", "Bandarban", "Rangamati"] },
      { name: "Rajshahi Division", cities: ["Rajshahi", "Bogura", "Joypurhat", "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Sirajganj"] },
      { name: "Khulna Division", cities: ["Khulna", "Bagerhat", "Satkhira", "Jashore", "Magura", "Narail", "Kushtia", "Chuadanga", "Meherpur"] },
      { name: "Barishal Division", cities: ["Barishal", "Bhola", "Patuakhali", "Pirojpur", "Jhalokati", "Barguna"] },
      { name: "Sylhet Division", cities: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"] },
      { name: "Rangpur Division", cities: ["Rangpur", "Dinajpur", "Thakurgaon", "Panchagarh", "Kurigram", "Lalmonirhat", "Nilphamari", "Gaibandha"] },
      { name: "Mymensingh Division", cities: ["Mymensingh", "Jamalpur", "Sherpur", "Netrokona"] },
    ],
  },
  {
    code: "IN", name: "India", states: [
      { name: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Rajahmundry"] },
      { name: "Bihar", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Arrah"] },
      { name: "Delhi", cities: ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"] },
      { name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Jamnagar"] },
      { name: "Karnataka", cities: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belgaum", "Gulbarga"] },
      { name: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kottayam"] },
      { name: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Satna"] },
      { name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"] },
      { name: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"] },
      { name: "Punjab", cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"] },
      { name: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"] },
      { name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"] },
      { name: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"] },
      { name: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Prayagraj", "Noida"] },
      { name: "West Bengal", cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman"] },
    ],
  },
  {
    code: "US", name: "United States", states: [
      { name: "California", cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno"] },
      { name: "New York", cities: ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany"] },
      { name: "Texas", cities: ["Houston", "Dallas", "San Antonio", "Austin", "Fort Worth", "El Paso"] },
      { name: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"] },
      { name: "Illinois", cities: ["Chicago", "Springfield", "Naperville", "Aurora", "Peoria"] },
      { name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"] },
      { name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"] },
      { name: "Georgia", cities: ["Atlanta", "Augusta", "Savannah", "Athens", "Macon"] },
      { name: "Washington", cities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Vancouver"] },
      { name: "Massachusetts", cities: ["Boston", "Cambridge", "Worcester", "Springfield", "Lowell"] },
    ],
  },
  {
    code: "GB", name: "United Kingdom", states: [
      { name: "England", cities: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Bristol", "Sheffield", "Cambridge", "Oxford"] },
      { name: "Scotland", cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"] },
      { name: "Wales", cities: ["Cardiff", "Swansea", "Newport", "Bangor"] },
      { name: "Northern Ireland", cities: ["Belfast", "Derry", "Lisburn", "Newry"] },
    ],
  },
  {
    code: "AU", name: "Australia", states: [
      { name: "New South Wales", cities: ["Sydney", "Newcastle", "Wollongong", "Canberra"] },
      { name: "Victoria", cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo"] },
      { name: "Queensland", cities: ["Brisbane", "Gold Coast", "Cairns", "Townsville"] },
      { name: "Western Australia", cities: ["Perth", "Fremantle", "Bunbury"] },
      { name: "South Australia", cities: ["Adelaide", "Mount Gambier", "Whyalla"] },
    ],
  },
  {
    code: "CA", name: "Canada", states: [
      { name: "Ontario", cities: ["Toronto", "Ottawa", "Hamilton", "London", "Mississauga"] },
      { name: "Quebec", cities: ["Montreal", "Quebec City", "Laval", "Gatineau"] },
      { name: "British Columbia", cities: ["Vancouver", "Victoria", "Kelowna", "Surrey"] },
      { name: "Alberta", cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"] },
    ],
  },
  {
    code: "PK", name: "Pakistan", states: [
      { name: "Punjab", cities: ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot"] },
      { name: "Sindh", cities: ["Karachi", "Hyderabad", "Sukkur", "Larkana"] },
      { name: "Khyber Pakhtunkhwa", cities: ["Peshawar", "Mardan", "Abbottabad", "Swat"] },
      { name: "Balochistan", cities: ["Quetta", "Gwadar", "Turbat"] },
      { name: "Islamabad Capital", cities: ["Islamabad"] },
    ],
  },
  {
    code: "AE", name: "United Arab Emirates", states: [
      { name: "Dubai", cities: ["Dubai"] },
      { name: "Abu Dhabi", cities: ["Abu Dhabi"] },
      { name: "Sharjah", cities: ["Sharjah"] },
      { name: "Ajman", cities: ["Ajman"] },
      { name: "Ras Al Khaimah", cities: ["Ras Al Khaimah"] },
      { name: "Fujairah", cities: ["Fujairah"] },
      { name: "Umm Al Quwain", cities: ["Umm Al Quwain"] },
    ],
  },
  {
    code: "SA", name: "Saudi Arabia", states: [
      { name: "Riyadh", cities: ["Riyadh"] },
      { name: "Makkah", cities: ["Mecca", "Jeddah", "Taif"] },
      { name: "Eastern Province", cities: ["Dammam", "Dhahran", "Khobar"] },
      { name: "Madinah", cities: ["Medina"] },
      { name: "Asir", cities: ["Abha"] },
    ],
  },
  {
    code: "SG", name: "Singapore", states: [
      { name: "Central Region", cities: ["Singapore"] },
    ],
  },
  {
    code: "MY", name: "Malaysia", states: [
      { name: "Kuala Lumpur", cities: ["Kuala Lumpur"] },
      { name: "Selangor", cities: ["Shah Alam", "Petaling Jaya", "Subang Jaya"] },
      { name: "Penang", cities: ["George Town", "Butterworth"] },
      { name: "Johor", cities: ["Johor Bahru", "Iskandar Puteri"] },
      { name: "Sarawak", cities: ["Kuching"] },
      { name: "Sabah", cities: ["Kota Kinabalu"] },
    ],
  },
  {
    code: "NP", name: "Nepal", states: [
      { name: "Bagmati", cities: ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur"] },
      { name: "Gandaki", cities: ["Pokhara", "Gorkha"] },
      { name: "Lumbini", cities: ["Bhairahawa", "Butwal"] },
      { name: "Koshi", cities: ["Biratnagar", "Dharan"] },
      { name: "Madhesh", cities: ["Janakpur", "Birgunj"] },
    ],
  },
  {
    code: "LK", name: "Sri Lanka", states: [
      { name: "Western", cities: ["Colombo", "Gampaha", "Kalutara"] },
      { name: "Central", cities: ["Kandy", "Matale", "Nuwara Eliya"] },
      { name: "Southern", cities: ["Galle", "Matara", "Hambantota"] },
      { name: "Northern", cities: ["Jaffna", "Kilinochchi"] },
      { name: "Eastern", cities: ["Trincomalee", "Batticaloa"] },
    ],
  },
  {
    code: "PH", name: "Philippines", states: [
      { name: "NCR", cities: ["Manila", "Quezon City", "Makati", "Pasig"] },
      { name: "Cebu", cities: ["Cebu City", "Mandaue", "Lapu-Lapu"] },
      { name: "Davao", cities: ["Davao City"] },
      { name: "Pampanga", cities: ["Angeles", "San Fernando"] },
    ],
  },
  {
    code: "ID", name: "Indonesia", states: [
      { name: "DKI Jakarta", cities: ["Jakarta"] },
      { name: "West Java", cities: ["Bandung", "Bekasi", "Bogor", "Depok"] },
      { name: "East Java", cities: ["Surabaya", "Malang", "Madiun"] },
      { name: "Central Java", cities: ["Semarang", "Solo", "Yogyakarta"] },
      { name: "Bali", cities: ["Denpasar"] },
    ],
  },
  {
    code: "TH", name: "Thailand", states: [
      { name: "Bangkok", cities: ["Bangkok"] },
      { name: "Chiang Mai", cities: ["Chiang Mai"] },
      { name: "Phuket", cities: ["Phuket"] },
      { name: "Nonthaburi", cities: ["Nonthaburi"] },
      { name: "Pattaya", cities: ["Pattaya"] },
    ],
  },
  {
    code: "VN", name: "Vietnam", states: [
      { name: "Ho Chi Minh City", cities: ["Ho Chi Minh City"] },
      { name: "Hanoi", cities: ["Hanoi"] },
      { name: "Da Nang", cities: ["Da Nang"] },
      { name: "Hai Phong", cities: ["Hai Phong"] },
      { name: "Can Tho", cities: ["Can Tho"] },
    ],
  },
  {
    code: "EG", name: "Egypt", states: [
      { name: "Cairo", cities: ["Cairo"] },
      { name: "Alexandria", cities: ["Alexandria"] },
      { name: "Giza", cities: ["Giza"] },
      { name: "Aswan", cities: ["Aswan"] },
    ],
  },
  {
    code: "TR", name: "Turkey", states: [
      { name: "Istanbul", cities: ["Istanbul"] },
      { name: "Ankara", cities: ["Ankara"] },
      { name: "Izmir", cities: ["Izmir"] },
      { name: "Bursa", cities: ["Bursa"] },
      { name: "Antalya", cities: ["Antalya"] },
    ],
  },
  {
    code: "NG", name: "Nigeria", states: [
      { name: "Lagos", cities: ["Lagos", "Ikeja", "Victoria Island"] },
      { name: "Abuja", cities: ["Abuja"] },
      { name: "Kano", cities: ["Kano"] },
      { name: "Rivers", cities: ["Port Harcourt"] },
    ],
  },
  {
    code: "ZA", name: "South Africa", states: [
      { name: "Gauteng", cities: ["Johannesburg", "Pretoria", "Sandton"] },
      { name: "Western Cape", cities: ["Cape Town"] },
      { name: "KwaZulu-Natal", cities: ["Durban", "Pietermaritzburg"] },
    ],
  },
  {
    code: "KE", name: "Kenya", states: [
      { name: "Nairobi", cities: ["Nairobi"] },
      { name: "Mombasa", cities: ["Mombasa"] },
      { name: "Kisumu", cities: ["Kisumu"] },
    ],
  },
  {
    code: "GH", name: "Ghana", states: [
      { name: "Greater Accra", cities: ["Accra", "Tema"] },
      { name: "Ashanti", cities: ["Kumasi"] },
      { name: "Western", cities: ["Takoradi"] },
    ],
  },
  {
    code: "DE", name: "Germany", states: [
      { name: "Bavaria", cities: ["Munich", "Nuremberg", "Augsburg"] },
      { name: "Berlin", cities: ["Berlin"] },
      { name: "Hamburg", cities: ["Hamburg"] },
      { name: "North Rhine-Westphalia", cities: ["Cologne", "Düsseldorf", "Dortmund"] },
      { name: "Hesse", cities: ["Frankfurt", "Wiesbaden"] },
    ],
  },
  {
    code: "FR", name: "France", states: [
      { name: "Île-de-France", cities: ["Paris", "Boulogne-Billancourt", "Saint-Denis"] },
      { name: "Provence-Alpes-Côte d'Azur", cities: ["Marseille", "Nice", "Cannes"] },
      { name: "Auvergne-Rhône-Alpes", cities: ["Lyon", "Grenoble", "Saint-Étienne"] },
    ],
  },
  {
    code: "JP", name: "Japan", states: [
      { name: "Tokyo", cities: ["Tokyo"] },
      { name: "Osaka", cities: ["Osaka", "Sakai"] },
      { name: "Kyoto", cities: ["Kyoto"] },
      { name: "Kanagawa", cities: ["Yokohama", "Kawasaki"] },
    ],
  },
  {
    code: "KR", name: "South Korea", states: [
      { name: "Seoul", cities: ["Seoul"] },
      { name: "Busan", cities: ["Busan"] },
      { name: "Incheon", cities: ["Incheon"] },
      { name: "Daegu", cities: ["Daegu"] },
    ],
  },
  {
    code: "CN", name: "China", states: [
      { name: "Beijing", cities: ["Beijing"] },
      { name: "Shanghai", cities: ["Shanghai"] },
      { name: "Guangdong", cities: ["Guangzhou", "Shenzhen", "Dongguan"] },
      { name: "Zhejiang", cities: ["Hangzhou", "Ningbo", "Wenzhou"] },
      { name: "Sichuan", cities: ["Chengdu"] },
    ],
  },
  {
    code: "BR", name: "Brazil", states: [
      { name: "São Paulo", cities: ["São Paulo", "Campinas", "Santos"] },
      { name: "Rio de Janeiro", cities: ["Rio de Janeiro", "Niterói"] },
      { name: "Minas Gerais", cities: ["Belo Horizonte"] },
      { name: "Bahia", cities: ["Salvador"] },
    ],
  },
];

/**
 * Get states for a given country name.
 */
export function getStatesForCountry(countryName: string): string[] {
  const country = LOCATIONS.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  if (!country) return [];
  return country.states.map((s) => s.name);
}

/**
 * Get cities for a given country + state.
 */
export function getCitiesForState(countryName: string, stateName: string): string[] {
  const country = LOCATIONS.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  if (!country) return [];
  const state = country.states.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  if (!state) return [];
  return state.cities;
}
