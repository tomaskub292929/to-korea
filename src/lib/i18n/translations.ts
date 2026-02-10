// Translations for all supported languages
export type Language = 'ko' | 'en' | 'ru' | 'zh' | 'uz';

export const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    'nav.schools': '대학교 찾기',
    'nav.about': '소개',
    'nav.faq': 'FAQ',
    'nav.login': '로그인',
    'nav.register': '회원가입',
    'nav.currentLanguage': '현재 언어',

    // Hero Section
    'hero.badge': '10,000+ 학생들이 신뢰하는 플랫폼',
    'hero.title': 'InBeam Test와 함께',
    'hero.titleLine2': '한국 유학을 시작하세요',
    'hero.subtitle': '한국 최고의 대학교를 찾고, 입학 지원까지 한 번에 해결하세요.',
    'hero.searchPlaceholder': '대학교명, 도시, 프로그램으로 검색...',
    'hero.schoolsTitle': '등록된 대학교',
    'hero.viewAll': '전체 보기',
    'hero.viewAllSchools': '모든 대학교 보기',
    'hero.students': '명',
    'hero.partnerSchools': '파트너 대학교',
    'hero.registeredStudents': '등록 학생',
    'hero.acceptanceRate': '합격률',

    // Search
    'search.placeholder': '대학교명, 도시, 프로그램으로 검색...',
    'search.found': '개 대학교 검색됨',
    'search.viewAll': '전체 보기',
    'search.noResults': '검색 결과가 없습니다',
    'search.tryDifferent': '다른 검색어를 입력해 보세요',
    'search.browseAll': '모든 대학교 보기',

    // Footer
    'footer.description': '한국 유학을 꿈꾸는 학생들을 위한 교육 플랫폼입니다.',
    'footer.platform': '플랫폼',
    'footer.account': '계정',
    'footer.legal': '법적 고지',
    'footer.browseSchools': '대학교 찾기',
    'footer.aboutUs': '소개',
    'footer.faq': 'FAQ',
    'footer.contact': '문의하기',
    'footer.signIn': '로그인',
    'footer.createAccount': '회원가입',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.copyright': '© 2026 InBeam Test. All rights reserved.',
  },

  en: {
    // Header
    'nav.schools': 'Browse Schools',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.login': 'Sign In',
    'nav.register': 'Sign Up',
    'nav.currentLanguage': 'Current language',

    // Hero Section
    'hero.badge': 'Trusted by 10,000+ students worldwide',
    'hero.title': 'Start Your Journey',
    'hero.titleLine2': 'to Korea with InBeam Test',
    'hero.subtitle': 'Discover top universities and apply for admission in South Korea.',
    'hero.searchPlaceholder': 'Search by university name, city, or program...',
    'hero.schoolsTitle': 'Featured Universities',
    'hero.viewAll': 'View All',
    'hero.viewAllSchools': 'Browse All Universities',
    'hero.students': ' students',
    'hero.partnerSchools': 'Partner Schools',
    'hero.registeredStudents': 'Students',
    'hero.acceptanceRate': 'Acceptance Rate',

    // Search
    'search.placeholder': 'Search by university name, city, or program...',
    'search.found': ' universities found',
    'search.viewAll': 'View All',
    'search.noResults': 'No universities found',
    'search.tryDifferent': 'Try a different search term',
    'search.browseAll': 'Browse All Universities',

    // Footer
    'footer.description': 'Connecting international students with educational opportunities in South Korea.',
    'footer.platform': 'Platform',
    'footer.account': 'Account',
    'footer.legal': 'Legal',
    'footer.browseSchools': 'Browse Schools',
    'footer.aboutUs': 'About Us',
    'footer.faq': 'FAQ',
    'footer.contact': 'Contact',
    'footer.signIn': 'Sign In',
    'footer.createAccount': 'Create Account',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2026 InBeam Test. All rights reserved.',
  },

  ru: {
    // Header
    'nav.schools': 'Университеты',
    'nav.about': 'О нас',
    'nav.faq': 'FAQ',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.currentLanguage': 'Текущий язык',

    // Hero Section
    'hero.badge': 'Нам доверяют более 10 000 студентов',
    'hero.title': 'Начните свой путь в Корею',
    'hero.titleLine2': 'вместе с InBeam Test',
    'hero.subtitle': 'Найдите лучшие университеты и подайте заявку на поступление в Южную Корею.',
    'hero.searchPlaceholder': 'Поиск по названию, городу или программе...',
    'hero.schoolsTitle': 'Рекомендуемые университеты',
    'hero.viewAll': 'Все',
    'hero.viewAllSchools': 'Все университеты',
    'hero.students': ' студентов',
    'hero.partnerSchools': 'Университетов',
    'hero.registeredStudents': 'Студентов',
    'hero.acceptanceRate': 'Поступление',

    // Search
    'search.placeholder': 'Поиск по названию, городу или программе...',
    'search.found': ' университетов найдено',
    'search.viewAll': 'Все',
    'search.noResults': 'Университеты не найдены',
    'search.tryDifferent': 'Попробуйте другой запрос',
    'search.browseAll': 'Все университеты',

    // Footer
    'footer.description': 'Платформа для студентов, мечтающих учиться в Южной Корее.',
    'footer.platform': 'Платформа',
    'footer.account': 'Аккаунт',
    'footer.legal': 'Документы',
    'footer.browseSchools': 'Университеты',
    'footer.aboutUs': 'О нас',
    'footer.faq': 'FAQ',
    'footer.contact': 'Контакты',
    'footer.signIn': 'Войти',
    'footer.createAccount': 'Регистрация',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.copyright': '© 2026 InBeam Test. Все права защищены.',
  },

  zh: {
    // Header
    'nav.schools': '浏览学校',
    'nav.about': '关于我们',
    'nav.faq': '常见问题',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.currentLanguage': '当前语言',

    // Hero Section
    'hero.badge': '全球10,000+学生的信赖之选',
    'hero.title': '与InBeam Test一起',
    'hero.titleLine2': '开启韩国留学之旅',
    'hero.subtitle': '发现韩国顶尖大学，一站式完成入学申请。',
    'hero.searchPlaceholder': '按大学名称、城市或专业搜索...',
    'hero.schoolsTitle': '精选大学',
    'hero.viewAll': '查看全部',
    'hero.viewAllSchools': '浏览所有大学',
    'hero.students': '名学生',
    'hero.partnerSchools': '合作大学',
    'hero.registeredStudents': '注册学生',
    'hero.acceptanceRate': '录取率',

    // Search
    'search.placeholder': '按大学名称、城市或专业搜索...',
    'search.found': '所大学',
    'search.viewAll': '查看全部',
    'search.noResults': '未找到大学',
    'search.tryDifferent': '请尝试其他搜索词',
    'search.browseAll': '浏览所有大学',

    // Footer
    'footer.description': '为梦想留学韩国的学生提供的教育平台。',
    'footer.platform': '平台',
    'footer.account': '账户',
    'footer.legal': '法律信息',
    'footer.browseSchools': '浏览学校',
    'footer.aboutUs': '关于我们',
    'footer.faq': '常见问题',
    'footer.contact': '联系我们',
    'footer.signIn': '登录',
    'footer.createAccount': '注册账户',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.copyright': '© 2026 InBeam Test. 版权所有。',
  },

  uz: {
    // Header
    'nav.schools': 'Universitetlar',
    'nav.about': 'Biz haqimizda',
    'nav.faq': 'FAQ',
    'nav.login': 'Kirish',
    'nav.register': "Ro'yxatdan o'tish",
    'nav.currentLanguage': 'Joriy til',

    // Hero Section
    'hero.badge': "10,000+ talabalar ishonch bildirgan platforma",
    'hero.title': 'InBeam Test bilan birga',
    'hero.titleLine2': "Koreya ta'limini boshlang",
    'hero.subtitle': "Koreyaning eng yaxshi universitetlarini toping va bir joyda ariza topshiring.",
    'hero.searchPlaceholder': "Universitet nomi, shahar yoki dastur bo'yicha qidiring...",
    'hero.schoolsTitle': "Ro'yxatdagi universitetlar",
    'hero.viewAll': "Barchasini ko'rish",
    'hero.viewAllSchools': "Barcha universitetlarni ko'rish",
    'hero.students': ' talaba',
    'hero.partnerSchools': 'Hamkor universitetlar',
    'hero.registeredStudents': 'Talabalar',
    'hero.acceptanceRate': "Qabul darajasi",

    // Search
    'search.placeholder': "Universitet nomi, shahar yoki dastur bo'yicha qidiring...",
    'search.found': ' ta universitet topildi',
    'search.viewAll': "Barchasini ko'rish",
    'search.noResults': 'Universitet topilmadi',
    'search.tryDifferent': "Boshqa so'z bilan qidirib ko'ring",
    'search.browseAll': "Barcha universitetlarni ko'rish",

    // Footer
    'footer.description': "Koreyada o'qishni orzu qilgan talabalar uchun ta'lim platformasi.",
    'footer.platform': 'Platforma',
    'footer.account': 'Hisob',
    'footer.legal': 'Huquqiy',
    'footer.browseSchools': 'Universitetlar',
    'footer.aboutUs': 'Biz haqimizda',
    'footer.faq': 'FAQ',
    'footer.contact': 'Aloqa',
    'footer.signIn': 'Kirish',
    'footer.createAccount': "Ro'yxatdan o'tish",
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.terms': 'Foydalanish shartlari',
    'footer.copyright': "© 2026 InBeam Test. Barcha huquqlar himoyalangan.",
  },
};

export function getTranslation(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations['ko'][key] || key;
}
