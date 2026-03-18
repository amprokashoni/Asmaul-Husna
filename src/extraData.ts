export interface NameDiff {
  title: string;
  items: {
    name: string;
    meaning: string;
    nuance: string;
  }[];
}

export interface SynAnt {
  type: 'synonym' | 'antonym';
  pair: [string, string];
  meaning: string;
}

export const nameDifferences: NameDiff[] = [
  {
    title: 'সৃষ্টিকারী (Creators)',
    items: [
      { name: 'আল-খালিক (Al-Khaliq)', meaning: 'সৃষ্টিকর্তা', nuance: 'যিনি অনস্তিত্ব থেকে কোনো কিছুকে অস্তিত্বে আনয়ন করেন।' },
      { name: 'আল-বারী (Al-Bari)', meaning: 'উদ্ভাবক', nuance: 'যিনি কোনো ত্রুটি ছাড়াই নিখুঁতভাবে সৃষ্টিকে অস্তিত্ব দান করেন।' },
      { name: 'আল-মুসাব্বির (Al-Musawwir)', meaning: 'রূপদানকারী', nuance: 'যিনি প্রতিটি সৃষ্টিকে আলাদা আলাদা আকৃতি, রঙ ও বৈশিষ্ট্য দান করেন।' }
    ]
  },
  {
    title: 'দয়াময় (Merciful)',
    items: [
      { name: 'আর-রাহমান (Ar-Rahman)', meaning: 'পরম দয়ালু', nuance: 'যিনি দুনিয়াতে সকল সৃষ্টির প্রতি (মুমিন-কাফির নির্বিশেষে) দয়াময়।' },
      { name: 'আর-রাহীম (Ar-Rahim)', meaning: 'অতিশয় দয়ালু', nuance: 'যিনি আখিরাতে শুধুমাত্র মুমিনদের প্রতি বিশেষভাবে দয়াময়।' }
    ]
  },
  {
    title: 'ক্ষমাশীল (Forgivers)',
    items: [
      { name: 'আল-গাফফার (Al-Ghaffar)', meaning: 'বারবার ক্ষমাশীল', nuance: 'যিনি বান্দার গুনাহ বারবার ঢেকে রাখেন এবং ক্ষমা করেন।' },
      { name: 'আল-গাফুর (Al-Ghafur)', meaning: 'পরম ক্ষমাশীল', nuance: 'যিনি গুনাহের পরিমাণ যাই হোক না কেন, তা ক্ষমা করার ক্ষমতা রাখেন।' },
      { name: 'আল-আফুউ (Al-Afuww)', meaning: 'মার্জনাকারী', nuance: 'যিনি গুনাহ ক্ষমা করার পাশাপাশি গুনাহের চিহ্ন পর্যন্ত মুছে দেন।' }
    ]
  },
  {
    title: 'জ্ঞানী (Knowledgeable)',
    items: [
      { name: 'আল-আলীম (Al-Alim)', meaning: 'সর্বজ্ঞ', nuance: 'যিনি দৃশ্য-অদৃশ্য সবকিছুর পূর্ণ জ্ঞান রাখেন।' },
      { name: 'আল-খাবীর (Al-Khabir)', meaning: 'সম্যক অবগত', nuance: 'যিনি প্রতিটি বিষয়ের সূক্ষ্মাতিসূক্ষ্ম রহস্য সম্পর্কে অবগত।' }
    ]
  }
];

export const synAntData: SynAnt[] = [
  { type: 'synonym', pair: ['আর-রাহমান', 'আর-রাহীম'], meaning: 'দয়া ও করুণা' },
  { type: 'synonym', pair: ['আল-গাফফার', 'আল-গাফুর'], meaning: 'ক্ষমা ও মার্জনা' },
  { type: 'synonym', pair: ['আল-কাহহার', 'আল-জাব্বার'], meaning: 'প্রবল প্রতাপ ও ক্ষমতা' },
  { type: 'antonym', pair: ['আল-মুইযয (সম্মানদাতা)', 'আল-মুযিল (অপমানদাতা)'], meaning: 'মর্যাদা ও লাঞ্ছনা' },
  { type: 'antonym', pair: ['আল-খাফিদ (অবনতকারী)', 'আর-রাফি (উন্নতকারী)'], meaning: 'উত্থান ও পতন' },
  { type: 'antonym', pair: ['আল-কাবিদ (সংকুচিতকারী)', 'আল-বাসিত (সম্প্রসারণকারী)'], meaning: 'রিযিক বা অবস্থা সংকুচিত ও প্রশস্ত করা' },
  { type: 'antonym', pair: ['আল-মুহয়ী (জীবনদাতা)', 'আল-মুমীত (মৃত্যুদাতা)'], meaning: 'জীবন ও মৃত্যু' },
  { type: 'antonym', pair: ['আল-আউয়াল (অনাদি)', 'আল-আখির (অনন্ত)'], meaning: 'শুরু ও শেষ' },
  { type: 'antonym', pair: ['আয-যাহির (প্রকাশ্য)', 'আল-বাতিন (গোপন)'], meaning: 'প্রকাশ্য ও অপ্রকাশ্য' }
];
