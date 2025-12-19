// ============================================
// DRUG DATABASE WITH ALL FIXES - CORRECTED VERSION
// ============================================
const drugDatabase = {
    heparin: {
        id: 'heparin',
        persianName: 'هپارین',
        englishName: 'Heparin',
        alternativeNames: ['هپارین سدیم', 'Heparin Sodium', 'Hepflush'],
        icon: 'fas fa-tint',
        color: '#667eea',
        category: 'Anticoagulant',
        defaultAmpoules: 2,
        ampouleOptions: [
            { strength: 5000, unit: 'units', volume: 1, label: '5000 units in 1 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'units/hour',
        weightBased: { 
            active: true, 
            unit: 'units/kg/hour', 
            typical: 12,
            range: { min: 10, max: 20 }
        },
        typicalDoseRange: { min: 500, max: 2000, unit: 'units/hour' },
        maxSafeConcentration: 200,
        solutionType: ['N/S', 'D5W'],
        ySiteCompatibilities: {
            compatible: ['مورفین', 'فنتانیل', 'دوپامین', 'میدازولام', 'پروپوفول'],
            incompatible: ['آموکسی سیلین', 'فنوباربیتال', 'هیدرالازین', 'ناکسیلین']
        },
        cautions: [
            'بررسی APTT هر 6 ساعت در درمان طولانی',
            'نظارت بر علائم خونریزی و هماتوم',
            'از تزریق عضلانی اکیداً خودداری شود',
            'در بیماران ترومبوسیتوپنی با احتیاط استفاده شود',
            'کنترل شمارش پلاکت هر 2-3 روز'
        ],
        preparationSteps: [
            'آماده کردن آمپول‌های هپارین',
            'کشیدن محلول سالین نرمال به سرنگ/کیسه',
            'اضافه کردن هپارین به محلول',
            'مخلوط کردن کامل',
            'نصب بر روی پمپ انفوزیون',
            'تنظیم سرعت پمپ بر اساس محاسبات'
        ]
    },
    lasix: {
        id: 'lasix',
        persianName: 'فوروزماید',
        englishName: 'Furosemide',
        alternativeNames: ['لازیکس', 'Lasix', 'Frusemide'],
        icon: 'fas fa-water',
        color: '#f093fb',
        category: 'Diuretic',
        defaultAmpoules: 5,
        ampouleOptions: [
            { strength: 20, unit: 'mg', volume: 2, label: '20 mg in 2 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mg/hour',
        weightBased: { active: false },
        typicalDoseRange: { min: 2, max: 40, unit: 'mg/hour' },
        maxRate: '4 mg/min',
        solutionType: ['N/S', 'D5W'],
        ySiteCompatibilities: {
            compatible: ['دوپامین', 'دوبوتامین', 'هپارین', 'میدازولام'],
            incompatible: ['جنتامایسین', 'ونکومایسین', 'سیپروفلوکساسین']
        },
        cautions: [
            'نظارت دقیق بر برون ده ادراری',
            'خطر دهیدراتاسیون و کاهش حجم',
            'بررسی الکترولیت‌ها هر 6 ساعت',
            'ممکن است باعث هایپوکالمی شود',
            'در بیماران با نارسایی کلیه احتیاط'
        ],
        preparationSteps: [
            'آماده کردن آمپول‌های فوروزماید',
            'کشیدن محلول به سرنگ/کیسه',
            'اضافه کردن دارو',
            'مخلوط کردن کامل',
            'تنظیم سرعت پمپ'
        ]
    },
    insulin: {
        id: 'insulin',
        persianName: 'انسولین رگولار',
        englishName: 'Regular Insulin',
        alternativeNames: ['انسولین معمولی', 'Humulin R', 'Actrapid'],
        icon: 'fas fa-syringe',
        color: '#ff6b6b',
        category: 'Hormone',
        defaultAmpoules: 1,
        ampouleOptions: [
            { strength: 100, unit: 'units', volume: 1, label: '100 units in 1 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'units/hour',
        weightBased: { 
            active: true, 
            unit: 'units/kg/hour', 
            typical: 0.1,
            range: { min: 0.05, max: 0.2 }
        },
        solutionType: ['N/S'],
        ySiteCompatibilities: {
            compatible: ['هپارین', 'پتاسیم کلراید'],
            incompatible: []
        },
        cautions: [
            'برچسب قرمز انسولین روی خط تزریق و پمپ',
            'کنترل گلوکز هر 1 ساعت در شروع درمان',
            'خطر هایپوگلیسمی شدید',
            'آنتی دوت: گلوکز 50%',
            'نظارت بر پتاسیم خون'
        ],
        preparationSteps: [
            'کشیدن انسولین از ویال',
            'اضافه کردن به سالین نرمال',
            'مخلوط کردن آرام',
            'نصب برچسب هشدار انسولین',
            'تنظیم پمپ'
        ]
    },
    fentanyl: {
        id: 'fentanyl',
        persianName: 'فنتانیل',
        englishName: 'Fentanyl',
        alternativeNames: ['Sublimaze', 'Duragesic'],
        icon: 'fas fa-head-side-mask',
        color: '#8b5cf6',
        category: 'Opioid',
        defaultAmpoules: 1,
        ampouleOptions: [
            { strength: 500, unit: 'mcg', volume: 10, label: '500 mcg in 10 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mcg/hour',
        weightBased: { 
            active: true, 
            unit: 'mcg/kg/hour', 
            typical: 1,
            range: { min: 0.5, max: 2 }
        },
        typicalDoseRange: { min: 25, max: 200, unit: 'mcg/hour' },
        solutionType: ['N/S', 'D5W'],
        ySiteCompatibilities: {
            compatible: ['هپارین', 'میدازولام', 'پروپوفول', 'دکسمدتومیدین'],
            incompatible: ['تیوپنتال', 'فنی توئین', 'باربیتورات‌ها']
        },
        cautions: [
            'خطر اوردوز و اپنه تنفسی',
            'آنتاگونیست: نالوکسان (Narcan)',
            'مانیتورینگ مداوم تنفس و سطح هوشیاری',
            'در سالمندان با احتیاط',
            'خطر وابستگی و تحمل'
        ],
        preparationSteps: [
            'آماده کردن فنتانیل',
            'کشیدن محلول',
            'اضافه کردن دارو',
            'مخلوط کردن',
            'تنظیم پمپ با مانیتورینگ تنفسی'
        ]
    },
    pantoprazole: {
        id: 'pantoprazole',
        persianName: 'پنتوپرازول',
        englishName: 'Pantoprazole',
        alternativeNames: ['پروتونیکس', 'Protonix', 'Pantoloc'],
        icon: 'fas fa-stomach',
        color: '#5ac8fa',
        category: 'PPI',
        defaultAmpoules: 2,
        ampouleOptions: [
            { strength: 40, unit: 'mg', volume: 10, label: '40 mg in vial' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mg/hour',
        weightBased: { active: false },
        solutionType: ['N/S'],
        infusionRate: 'حداکثر 7 ml/min',
        ySiteCompatibilities: {
            compatible: ['نرمال سالین', 'Ringer lactate'],
            incompatible: ['دیازپام', 'فوروزماید', 'ونکومایسین']
        },
        cautions: [
            'از مخلوط کردن با سایر داروها خودداری شود',
            'در بیماران با اختلال کبدی احتیاط',
            'ممکن است باعث هایپومنیزیمی شود'
        ],
        preparationSteps: [
            'مخلوط کردن ویال با محلول',
            'کشیدن به سرنگ/کیسه',
            'تنظیم سرعت تزریق آهسته',
            'نظارت بر واکنش بیمار'
        ]
    },
    tng: {
        id: 'tng',
        persianName: 'نیتروگلیسیرین',
        englishName: 'Nitroglycerin',
        alternativeNames: ['نیتروگلیسیرین', 'Nitrostat', 'Nitro-Bid'],
        icon: 'fas fa-heartbeat',
        color: '#ffa726',
        category: 'Vasodilator',
        defaultAmpoules: 1,
        ampouleOptions: [
            { strength: 5, unit: 'mg', volume: 1, label: '5 mg in 1 ml' },
            { strength: 10, unit: 'mg', volume: 1, label: '10 mg in 1 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mcg/min',
        weightBased: { active: false },
        typicalDoseRange: { min: 5, max: 200, unit: 'mcg/min' },
        solutionType: ['D5W'],
        ySiteCompatibilities: {
            compatible: ['دوپامین', 'دوبوتامین', 'هپارین'],
            incompatible: []
        },
        cautions: [
            'مانیتورینگ فشار خون هر 5-15 دقیقه',
            'سردرد نشانه اثربخشی است',
            'ممنوعیت همراهی با سیلدنافیل (Viagra)',
            'خطر افت فشار وضعیتی',
            'توله‌رانس در 24-48 ساعت'
        ],
        preparationSteps: [
            'استفاده از D5W فقط (نه NS)',
            'آماده کردن دارو',
            'تنظیم پمپ',
            'مانیتورینگ فشار خون مداوم'
        ]
    },
    norepinephrine: {
    id: 'norepinephrine',
    persianName: 'نوراپی نفرین',
    englishName: 'Norepinephrine',
    alternativeNames: ['لوووفد', 'Levophed', 'Noradrenaline'],
    icon: 'fas fa-heart-pulse',
    color: '#4cd964',
    category: 'Vasopressor',
    defaultAmpoules: 1,
    ampouleOptions: [
        { strength: 4, unit: 'mg', volume: 4, label: '4 mg in 4 cc' },
        { strength: 5, unit: 'mg', volume: 10, label: '5 mg in 10 cc' },
        { strength: 10, unit: 'mg', volume: 10, label: '10 mg in 10 cc' }
    ],
    defaultSolutionVolumes: { 
        syringe: [10, 20, 50], 
        infusion: [100, 250, 500, 1000] 
    },
    defaultVolume: { syringe: 50, infusion: 100 },
    standardUnit: 'mcg/min', // Default non-weight-based unit
    weightBased: { 
        active: true, 
        unit: 'mcg/kg/min', // Weight-based unit
        nonWeightUnit: 'mcg/min', // Non-weight-based unit
        typical: 0.1,
        range: { min: 0.05, max: 0.3 },
        defaultUseWeight: false, // Default to non-weight-based
        defaultWeight: 70
    },
    typicalDoseRange: { min: 0.05, max: 0.3, unit: 'mcg/kg/min' },
    solutionType: ['D5W'],
    lineRequirement: 'لاین مرکزی ترجیحاً (در غلظت‌های بالا)',
    ySiteCompatibilities: {
        compatible: ['دوپامین', 'دوبوتامین', 'وازوپرسین'],
        incompatible: ['ناکسیلین', 'فنتانیل در غلظت بالا', 'بی‌کربنات سدیم']
    },
    cautions: [
        'اکستراوزاسیون خطر نکروز دارد',
        'پمپ باید از خط انفوزیون جدا باشد',
        'مانیتورینگ فشار خون مستمر',
        'لاین مرکزی در دوزهای بالا الزامی است',
        'خطر آریتمی و هایپرتانسیون'
    ],
    preparationSteps: [
        'استفاده از D5W فقط',
        'آماده کردن در لاین مرکزی',
        'تنظیم پمپ جداگانه',
        'مانیتورینگ دقیق فشار خون'
    ]
},
    midazolam: {
        id: 'midazolam',
        persianName: 'میدازولام',
        englishName: 'Midazolam',
        alternativeNames: ['ورسید', 'Versed', 'Hypnovel'],
        icon: 'fas fa-bed',
        color: '#764ba2',
        category: 'Benzodiazepine',
        defaultAmpoules: 5,
        ampouleOptions: [
            { strength: 5, unit: 'mg', volume: 1, label: '5 mg in 1 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mg/hour',
        weightBased: { 
            active: true, 
            unit: 'mcg/kg/min', 
            typical: 1,
            range: { min: 0.5, max: 5 }
        },
        typicalDoseRange: { min: 0.02, max: 0.1, unit: 'mg/kg/hour' },
        solutionType: ['N/S', 'D5W'],
        ySiteCompatibilities: {
            compatible: ['هپارین', 'فنتانیل', 'پروپوفول'],
            incompatible: ['تیوپنتال', 'کتوکونازول', 'ایتراکونازول']
        },
        antagonist: 'فلومازنیل (Anexate)',
        cautions: [
            'خطر افسردگی تنفسی',
            'مانیتورینگ سطح هوشیاری و تنفس',
            'در سالمندان با احتیاط',
            'آنتاگونیست: فلومازنیل',
            'خطر پارادوکسیکال ریکشن'
        ],
        preparationSteps: [
            'آماده کردن دارو',
            'تنظیم پمپ',
            'مانیتورینگ تنفس و سطح هوشیاری',
            'دسترسی به فلومازنیل'
        ]
    },
    octreotide: {
        id: 'octreotide',
        persianName: 'اکترئوتاید',
        englishName: 'Octreotide',
        alternativeNames: ['ساندوستاتین', 'Sandostatin'],
        icon: 'fas fa-seedling',
        color: '#f5576c',
        category: 'Somatostatin',
        defaultAmpoules: 5,
        ampouleOptions: [
            { strength: 50, unit: 'mcg', volume: 1, label: '50 mcg in 1 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mcg/hour',
        weightBased: { active: false },
        typicalDoseRange: { min: 25, max: 50, unit: 'mcg/hour' },
        solutionType: ['N/S'],
        ySiteCompatibilities: {
            compatible: ['نرمال سالین', 'هپارین'],
            incompatible: ['TPN', 'لیپیدها']
        },
        cautions: [
            'نظارت بر قند خون',
            'ممکن است نیاز به کاهش دوز انسولین باشد',
            'خطر سنگ کیسه صفرا در درمان طولانی',
            'در بیماران دیابتی احتیاط'
        ],
        preparationSteps: [
            'آماده کردن با سالین نرمال',
            'تنظیم پمپ',
            'نظارت بر قند خون',
            'ذخیره در یخچال اگر فوری استفاده نشود'
        ]
    },
    labetalol: {
        id: 'labetalol',
        persianName: 'لابتالول',
        englishName: 'Labetalol',
        alternativeNames: ['تراندیت', 'Trandate', 'Normodyne'],
        icon: 'fas fa-heart',
        color: '#4facfe',
        category: 'Alpha-Beta Blocker',
        defaultAmpoules: 1,
        ampouleOptions: [
            { strength: 100, unit: 'mg', volume: 20, label: '100 mg in vial' }
        ],
        defaultSolutionVolumes: { 
            syringe: [10, 20, 50], 
            infusion: [100, 250, 500, 1000] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mg/min',
        weightBased: { active: false },
        typicalDoseRange: { min: 20, max: 160, unit: 'mg/hour' },
        solutionType: ['D5W'],
        maxConcentration: '1 mg/ml',
        ySiteCompatibilities: {
            compatible: ['نرمال سالین', 'هپارین'],
            incompatible: ['بی‌کربنات سدیم', 'فوروزماید']
        },
        cautions: [
            'در بیماران آسمی و COPD ممنوع',
            'مانیتورینگ فشار خون و ضربان قلب',
            'در بارداری با احتیاط',
            'خطر برادی کاردی و بلوک قلبی',
            'در نارسایی قلبی احتیاط'
        ],
        preparationSteps: [
            'مخلوط کردن با D5W',
            'تنظیم پمپ',
            'مانیتورینگ فشار خون و ضربان قلب',
            'پرهیز از تزریق سریع'
        ]
    },
    dopamine: {
    id: 'dopamine',
    persianName: 'دوپامین',
    englishName: 'Dopamine',
    alternativeNames: ['اینوتروپ', 'Dopastat', 'Intropin'],
    icon: 'fas fa-heartbeat',
    color: '#ff4081',
    category: 'Vasopressor/Cardiac Stimulant',
    defaultAmpoules: 1,
    ampouleOptions: [
        { strength: 200, unit: 'mg', volume: 5, label: '200 mg in 5 ml' }
    ],
    defaultSolutionVolumes: { 
        syringe: [10, 20, 50], 
        infusion: [100, 250, 500, 1000] 
    },
    defaultVolume: { syringe: 50, infusion: 250 },
    standardUnit: 'mcg/min', // Default non-weight-based unit
    weightBased: { 
        active: true, 
        unit: 'mcg/kg/min', // Weight-based unit
        nonWeightUnit: 'mcg/min', // Non-weight-based unit
        typical: 5,
        range: { min: 2, max: 20 },
        defaultUseWeight: false, // Default to non-weight-based
        defaultWeight: 70
    },
    typicalDoseRange: { min: 2, max: 20, unit: 'mcg/kg/min' },
    solutionType: ['D5W', 'N/S'],
    lineRequirement: 'لاین مرکزی در دوزهای بالا',
    ySiteCompatibilities: {
        compatible: ['دوپامین', 'دوبوتامین', 'نوراپی نفرین', 'میدازولام'],
        incompatible: ['ناکسیلین', 'فنتانیل در غلظت بالا', 'بی‌کربنات سدیم', 'آمینوفیلین']
    },
    cautions: [
        'تزریق از لاین مرکزی برای دوزهای بالای 10 mcg/kg/min',
        'مانیتورینگ فشار خون، ضربان قلب و ریتم قلبی',
        'خطر تاکیکاردی و آریتمی',
        'در بیماران با فئوکروموسیتوما ممنوع',
        'اکستراوزاسیون خطر نکروز دارد'
    ],
    preparationSteps: [
        'آماده کردن ویال دوپامین',
        'مخلوط کردن با D5W یا N/S',
        'تزریق از لاین مرکزی برای دوزهای بالا',
        'تنظیم پمپ',
        'مانیتورینگ مداوم علائم حیاتی'
    ]
},
    amiodarone: {
        id: 'amiodarone',
        persianName: 'آمیودارون',
        englishName: 'Amiodarone',
        alternativeNames: ['کوردارون', 'Cordarone', 'Pacerone'],
        icon: 'fas fa-heartbeat',
        color: '#4CAF50',
        category: 'Antiarrhythmic',
        defaultAmpoules: 2,
        ampouleOptions: [
            { strength: 150, unit: 'mg', volume: 3, label: '150 mg in 3 ml' }
        ],
        defaultSolutionVolumes: { 
            syringe: [50, 100], 
            infusion: [50, 100, 250, 500] 
        },
        defaultVolume: { syringe: 50, infusion: 100 },
        standardUnit: 'mg/min',
        weightBased: { active: false },
        typicalDoseRange: { min: 0.5, max: 1, unit: 'mg/min' },
        solutionType: ['D5W'],
        ySiteCompatibilities: {
            compatible: ['لیدوکائین', 'فوروزماید'],
            incompatible: ['هپارین', 'بی‌کربنات سدیم']
        },
        cautions: [
            'بررسی سطح تیروئید و کبد قبل از شروع درمان',
            'خطر فیبروز ریوی در درمان طولانی',
            'بررسی سطح دارو در خون',
            'خطر آریتمی',
            'در بیماران با اختلال تیروئید احتیاط'
        ],
        preparationSteps: [
            'استفاده از D5W فقط',
            'آماده کردن دارو',
            'مخلوط کردن کامل',
            'تنظیم پمپ',
            'مانیتورینگ قلبی'
        ]
    }
};

// Search function
function searchDrugs(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
        return Object.keys(drugDatabase);
    }
    
    const results = [];
    
    Object.entries(drugDatabase).forEach(([id, drug]) => {
        const searchableText = [
            drug.persianName,
            drug.englishName,
            drug.category,
            ...(drug.alternativeNames || [])
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(normalizedQuery)) {
            results.push(id);
        }
    });
    
    return results;
}

// Make functions available globally
window.drugDatabase = drugDatabase;
window.searchDrugs = searchDrugs;