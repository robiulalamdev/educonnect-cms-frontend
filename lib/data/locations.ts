// Bangladesh-only location data — Division → District → Areas
// No Google API needed. Complete BD coverage.

export interface DivisionData {
  name: string;
  bn: string; // Bangla name
  districts: DistrictData[];
}

export interface DistrictData {
  name: string;
  bn: string;
  areas: string[];
}

export const DIVISIONS: DivisionData[] = [
  {
    name: "Dhaka", bn: "ঢাকা", districts: [
      { name: "Dhaka", bn: "ঢাকা", areas: ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur", "Tejgaon", "Motijheel", "Ramna", "Lalbagh", "Wari", "Badda", "Khilgaon", "Rampura", "Bashundhara", "Cantonment", "Pallabi", "Kafrul", "Shyamoli", "Kalabagan"] },
      { name: "Gazipur", bn: "গাজীপুর", areas: ["Tongi", "Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"] },
      { name: "Narayanganj", bn: "নারায়ণগঞ্জ", areas: ["Narayanganj Sadar", "Sonargaon", "Araihazar", "Rupganj", "Bandar"] },
      { name: "Tangail", bn: "টাঙ্গাইল", areas: ["Tangail Sadar", "Madhupur", "Gopalpur", "Mirzapur", "Kalihati", "Ghatail", "Sakhipur", "Basail", "Delduar", "Nagarpur", "Bhuapur", "Dhanbari"] },
      { name: "Kishoreganj", bn: "কিশোরগঞ্জ", areas: ["Kishoreganj Sadar", "Bhairab", "Kuliarchar", "Hossainpur", "Pakundia", "Karimganj", "Katiadi", "Tarail", "Itna", "Mithamain", "Austagram", "Nikli", "Bajitpur"] },
      { name: "Manikganj", bn: "মানিকগঞ্জ", areas: ["Manikganj Sadar", "Singair", "Saturia", "Harirampur", "Ghior", "Shibalaya", "Daulatpur"] },
      { name: "Munshiganj", bn: "মুন্সিগঞ্জ", areas: ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Lohajang", "Gazaria", "Tongibari"] },
      { name: "Narsingdi", bn: "নরসিংদী", areas: ["Narsingdi Sadar", "Shibpur", "Raipura", "Belabo", "Monohardi", "Palash"] },
      { name: "Faridpur", bn: "ফরিদপুর", areas: ["Faridpur Sadar", "Boalmari", "Alfadanga", "Madhukhali", "Bhanga", "Nagarkanda", "Sadarpur", "Charbhadrasan", "Saltha"] },
      { name: "Gopalganj", bn: "গোপালগঞ্জ", areas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"] },
      { name: "Madaripur", bn: "মাদারীপুর", areas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"] },
      { name: "Rajbari", bn: "রাজবাড়ী", areas: ["Rajbari Sadar", "Goalandaghat", "Pangsha", "Baliakandi", "Kalukhali"] },
      { name: "Shariatpur", bn: "শরীয়তপুর", areas: ["Shariatpur Sadar", "Naria", "Zajira", "Gosairhat", "Bhedarganj", "Damudya"] },
    ],
  },
  {
    name: "Chattogram", bn: "চট্টগ্রাম", districts: [
      { name: "Chattogram", bn: "চট্টগ্রাম", areas: ["Agrabad", "GEC", "Nasirabad", "Halishahar", "Pahartali", "Patenga", "Kotwali", "Double Mooring", "Chandgaon", "Bayazid Bostami", "Bakalia", "Chawkbazar", "Karnaphuli", "Sitakunda", "Mirsharai", "Sandwip", "Patiya", "Raozan", "Rangunia"] },
      { name: "Cox's Bazar", bn: "কক্সবাজার", areas: ["Cox's Bazar Sadar", "Teknaf", "Ukhia", "Ramu", "Maheshkhali", "Kutubdia", "Chakaria", "Pekua"] },
      { name: "Comilla", bn: "কুমিল্লা", areas: ["Comilla Sadar", "Debidwar", "Barura", "Chandina", "Chauddagram", "Daudkandi", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Brahmanpara", "Meghna", "Monoharganj", "Titas", "Burichang", "Lalmai"] },
      { name: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", areas: ["Brahmanbaria Sadar", "Ashuganj", "Nabinagar", "Bancharampur", "Kasba", "Akhaura", "Nasirnagar", "Sarail", "Bijoynagar"] },
      { name: "Chandpur", bn: "চাঁদপুর", areas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab North", "Matlab South", "Shahrasti"] },
      { name: "Lakshmipur", bn: "লক্ষ্মীপুর", areas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"] },
      { name: "Noakhali", bn: "নোয়াখালী", areas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabir Hat", "Senbagh", "Sonaimuri", "Subarnachar"] },
      { name: "Feni", bn: "ফেনী", areas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Sonagazi", "Fulgazi"] },
      { name: "Khagrachhari", bn: "খাগড়াছড়ি", areas: ["Khagrachhari Sadar", "Dighinala", "Panchhari", "Lakshmichhari", "Mahalchhari", "Manikchari", "Matiranga", "Ramgarh", "Guimara"] },
      { name: "Rangamati", bn: "রাঙ্গামাটি", areas: ["Rangamati Sadar", "Kaptai", "Kawkhali", "Bagaichhari", "Barkal", "Langadu", "Rajasthali", "Belaichhari", "Juraichhari", "Naniarchar"] },
      { name: "Bandarban", bn: "বান্দরবান", areas: ["Bandarban Sadar", "Thanchi", "Ruma", "Rowangchhari", "Lama", "Ali Kadam", "Naikhongchhari"] },
    ],
  },
  {
    name: "Rajshahi", bn: "রাজশাহী", districts: [
      { name: "Rajshahi", bn: "রাজশাহী", areas: ["Rajshahi City", "Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Godagari", "Tanore", "Bagmara", "Puthia", "Durgapur", "Bagha", "Charghat", "Mohanpur", "Paba"] },
      { name: "Bogura", bn: "বগুড়া", areas: ["Bogura Sadar", "Gabtali", "Sherpur", "Shajahanpur", "Kahaloo", "Dupchanchia", "Adamdighi", "Nandigram", "Sonatala", "Shibganj", "Sariakandi", "Dhunat"] },
      { name: "Joypurhat", bn: "জয়পুরহাট", areas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"] },
      { name: "Naogaon", bn: "নওগাঁ", areas: ["Naogaon Sadar", "Manda", "Niamatpur", "Atrai", "Raninagar", "Patnitala", "Dhamoirhat", "Mohadevpur", "Badalgachhi", "Porsha", "Sapahar"] },
      { name: "Natore", bn: "নাটোর", areas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"] },
      { name: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ", areas: ["Chapainawabganj Sadar", "Shibganj", "Gomostapur", "Nachole", "Bholahat"] },
      { name: "Pabna", bn: "পাবনা", areas: ["Pabna Sadar", "Ishwardi", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Atgharia", "Santhia", "Sujanagar"] },
      { name: "Sirajganj", bn: "সিরাজগঞ্জ", areas: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"] },
    ],
  },
  {
    name: "Khulna", bn: "খুলনা", districts: [
      { name: "Khulna", bn: "খুলনা", areas: ["Khulna City", "Sonadanga", "Khalishpur", "Boyra", "Daulatpur", "Dumuria", "Phultala", "Batiaghata", "Dakop", "Koyra", "Paikgachha", "Terokhada", "Rupsa", "Dighalia"] },
      { name: "Bagerhat", bn: "বাগেরহাট", areas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"] },
      { name: "Satkhira", bn: "সাতক্ষীরা", areas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"] },
      { name: "Jashore", bn: "যশোর", areas: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"] },
      { name: "Magura", bn: "মাগুরা", areas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"] },
      { name: "Narail", bn: "নড়াইল", areas: ["Narail Sadar", "Kalia", "Lohagara"] },
      { name: "Kushtia", bn: "কুষ্টিয়া", areas: ["Kushtia Sadar", "Kumarkhali", "Khoksa", "Mirpur", "Bheramara", "Daulatpur"] },
      { name: "Chuadanga", bn: "চুয়াডাঙ্গা", areas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"] },
      { name: "Meherpur", bn: "মেহেরপুর", areas: ["Meherpur Sadar", "Gangni", "Mujibnagar"] },
      { name: "Jhenaidah", bn: "ঝিনাইদহ", areas: ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"] },
    ],
  },
  {
    name: "Barishal", bn: "বরিশাল", districts: [
      { name: "Barishal", bn: "বরিশাল", areas: ["Barishal City", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Mehendiganj", "Muladi", "Hizla"] },
      { name: "Bhola", bn: "ভোলা", areas: ["Bhola Sadar", "Borhanuddin", "Charfasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"] },
      { name: "Patuakhali", bn: "পটুয়াখালী", areas: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali"] },
      { name: "Pirojpur", bn: "পিরোজপুর", areas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"] },
      { name: "Jhalokati", bn: "ঝালকাঠি", areas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"] },
      { name: "Barguna", bn: "বরগুনা", areas: ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"] },
    ],
  },
  {
    name: "Sylhet", bn: "সিলেট", districts: [
      { name: "Sylhet", bn: "সিলেট", areas: ["Sylhet City", "Zindabazar", "Amberkhana", "Subid Bazar", "Tilagarh", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "South Surma", "Zakiganj", "Dakshin Surma", "Osmaninagar"] },
      { name: "Moulvibazar", bn: "মৌলভীবাজার", areas: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"] },
      { name: "Habiganj", bn: "হবিগঞ্জ", areas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"] },
      { name: "Sunamganj", bn: "সুনামগঞ্জ", areas: ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sulla", "Tahirpur", "Shantiganj"] },
    ],
  },
  {
    name: "Rangpur", bn: "রংপুর", districts: [
      { name: "Rangpur", bn: "রংপুর", areas: ["Rangpur City", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"] },
      { name: "Dinajpur", bn: "দিনাজপুর", areas: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"] },
      { name: "Thakurgaon", bn: "ঠাকুরগাঁও", areas: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"] },
      { name: "Panchagarh", bn: "পঞ্চগড়", areas: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"] },
      { name: "Kurigram", bn: "কুড়িগ্রাম", areas: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Nageshwari", "Phulbari", "Rajarhat", "Raumari", "Ulipur"] },
      { name: "Lalmonirhat", bn: "লালমনিরহাট", areas: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"] },
      { name: "Nilphamari", bn: "নীলফামারী", areas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"] },
      { name: "Gaibandha", bn: "গাইবান্ধা", areas: ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"] },
    ],
  },
  {
    name: "Mymensingh", bn: "ময়মনসিংহ", districts: [
      { name: "Mymensingh", bn: "ময়মনসিংহ", areas: ["Mymensingh City", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal", "Tarakanda"] },
      { name: "Jamalpur", bn: "জামালপুর", areas: ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"] },
      { name: "Sherpur", bn: "শেরপুর", areas: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"] },
      { name: "Netrokona", bn: "নেত্রকোণা", areas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"] },
    ],
  },
];

/**
 * Get all division names.
 */
export function getDivisions(): string[] {
  return DIVISIONS.map((d) => d.name);
}

/**
 * Get districts for a given division.
 */
export function getDistricts(divisionName: string): string[] {
  const division = DIVISIONS.find(
    (d) => d.name.toLowerCase() === divisionName.toLowerCase()
  );
  if (!division) return [];
  return division.districts.map((d) => d.name);
}

/**
 * Get areas/upazilas for a given division + district.
 */
export function getAreas(divisionName: string, districtName: string): string[] {
  const division = DIVISIONS.find(
    (d) => d.name.toLowerCase() === divisionName.toLowerCase()
  );
  if (!division) return [];
  const district = division.districts.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase()
  );
  if (!district) return [];
  return district.areas;
}

// ── Legacy compatibility (for backend fields: country / state / city) ──
// country = "Bangladesh" (always)
// state = division name
// city = district name
// area = area/upazila name

export function getStatesForCountry(_countryName: string): string[] {
  return getDivisions();
}

export function getCitiesForState(_countryName: string, stateName: string): string[] {
  return getDistricts(stateName);
}
