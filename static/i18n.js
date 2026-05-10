/**
 * ZAS Tech — EN / Kurdish Sorani (Arabic script) / Arabic
 * Persists choice in localStorage under key "zas-lang"
 */
(function () {
  const STORAGE_KEY = "zas-lang";
  const DEFAULT_LANG = "en";

  /** @type {Record<string, Record<string, unknown>>} */
  const STRINGS = {
    en: {
      meta: {
        title: "ZAS Tech — Empowering Businesses with Digital Services",
        description:
          "ZAS Tech helps businesses with software, websites and apps, AI, online safety, smart camera solutions, and moving work online.",
        ogTitle: "ZAS Tech — Digital Services & Innovation",
        ogDesc:
          "Software, websites and apps, AI, cybersecurity, camera-based solutions, and helping your business go digital.",
      },
      skip: "Skip to content",
      nav: { home: "Home", services: "Services", about: "About", projects: "Projects", contact: "Contact" },
      aria: {
        logo: "ZAS Tech home",
        menuOpen: "Open menu",
        menuClose: "Close menu",
        menuDialog: "Menu",
        highlights: "Highlights",
        primaryNav: "Primary",
      },
      mobile: { title: "Navigate", close: "Close" },
      lang: { label: "Language", en: "English", ku: "Kurdish", ar: "Arabic" },
      hero: {
        badge: "Tech · AI · Safe systems · Digital growth",
        title1: "Empowering Businesses",
        title2: "with Our Digital Services",
        intro:
          "We build apps, websites, and behind-the-scenes software; add AI where it helps; keep your systems safer online; and use cameras and images when your business needs them. We also help you move everyday work to modern digital tools — step by step.",
        cta1: "Get Started",
        cta2: "Explore Services",
        chip1: "Going digital",
        chip2: "Safer online",
        chip3: "Built for real use",
      },
      mockup: {
        preview: "Preview — your tools",
        workspace: "Your workspace",
        subtitle: "Software that fits how you work",
        aiReady: "AI ready",
        speed: "Speed",
        fast: "Fast",
        online: "Online",
        stable: "Stable",
        safety: "Safety",
        protected: "Protected",
        launch: "Ready to launch",
      },
      metrics: {
        title: "At a glance",
        line: "Apps · Safe online · AI · Smart cameras · Going digital",
        s1: "Solutions shipped",
        s2: "Main service areas",
        s3: "Commitment to quality",
      },
      services: {
        kicker: "Services",
        title: "What we can do for you",
        intro:
          "Clear services you can choose from — built to work together when you need more than one. Safety and quality matter on every project.",
        soft: {
          tag: "Build",
          title: "Software Development",
          desc: "Custom software that connects your tools and teams: internal apps, integrations with other systems, and code that is easy to maintain as you grow.",
        },
        cyber: {
          tag: "Protect",
          title: "Cybersecurity",
          desc: "Stronger protection for your data and accounts: safer setups, sensible checks, and practical steps that lower risk without blocking your work.",
        },
        ai: {
          tag: "Intelligence",
          title: "AI Solutions",
          desc: "Artificial intelligence that saves time: helpers for your staff, automatic sorting or tagging, simple dashboards, and smarter answers from your own data.",
        },
        vision: {
          tag: "Vision",
          title: "Computer Vision",
          desc: 'Teach cameras and photos to "see" for your business: spotting objects or defects, counting items, and supporting checks — on your premises or using cloud tools when it fits.',
        },
        web: {
          tag: "Experience",
          title: "Web & Mobile Applications",
          desc: "Websites and phone apps that look good and are easy to use — fast loading, clear layouts, and steady updates when you need them.",
        },
      },
      about: {
        kicker: "About us",
        title: "Practical tech, explained clearly",
        p1: "ZAS Tech builds digital products and technology solutions for businesses that want results they can trust. We turn messy ideas into simple, working software — and we explain choices in plain language, not jargon.",
        p2: "Whether you are updating old manual processes or starting something new, we stay close from first conversation through launch: clear steps, realistic timelines, and room to adjust as we learn together.",
        focusL: "We focus on",
        focusB: "Apps · AI · Safe systems · Camera tech · Websites",
        workL: "How we work",
        workB: "Regular updates & goals you can measure",
        cardTitle: "What we care about",
        pt1: "Reliability — systems that stay up when people depend on them.",
        pt2: "Security — safer defaults for data and logins.",
        pt3: "Steady progress — useful releases on a schedule you can plan around.",
      },
      projects: {
        kicker: "Examples",
        title: "Sample projects",
        intro:
          "The kinds of work we take on — names can be changed for privacy. Each project is shaped around the client’s real needs.",
        p1: {
          tag: "Platform",
          title: "Operations dashboard",
          desc: "One screen for a leadership team to see live numbers, who can see what, and simple alerts when something needs attention.",
          foot: "Built with a modern website stack and secure connections between services.",
        },
        p2: {
          tag: "Vision",
          title: "Factory checks with cameras",
          desc: "Camera-based inspection with a simple review screen so staff spend less time on false alarms and more time fixing real issues.",
          foot: "Includes tuning the model and safe rollout steps.",
        },
        p3: {
          tag: "Security",
          title: "Safer logins for a growing product",
          desc: "Tighter rules for who can access what, without making everyday login painful for customers.",
          foot: "Result: smaller target for attackers, same smooth experience for users.",
        },
      },
      contact: {
        kicker: "Contact",
        title: "Get in touch",
        intro:
          "Send a short note about what you need. We’ll reply with next steps, a rough timeline, and honest expectations — no hard sell.",
        name: "Name",
        email: "Email",
        details: "Project details",
        phName: "Your name",
        phEmail: "you@organization.com",
        phMsg: "What you want to achieve, when you hope to start, and anything else we should know.",
        submit: "Send message",
        emailUs: "Email us",
        note: "We answer with clear next steps — no fluff.",
        hp: "Don’t fill this out:",
        asideTitle: "Contact details",
        asideIntro: "Email or call us for new projects, questions, or a quick chat about fit.",
        emailLbl: "Email",
        phoneLbl: "Phone",
        mailBtn: "Mail",
        callBtn: "Call",
        availTitle: "Accepting new engagements",
        availBody:
          "Tell us what you need — we’ll agree on scope, schedule, and how we keep your data safe before we start.",
      },
      footer: {
        tagline: "Software, apps, AI, online safety, smart cameras, and helping you go digital.",
        rights: "All rights reserved.",
      },
      thanks: {
        title: "Message received — ZAS Tech",
        metaDesc: "Thank you — ZAS Tech has received your message.",
        h1: "Message received",
        p: "We’ll respond with clear next steps.",
        home: "Back to Home",
        email: "Email Directly",
      },
    },

    ku: {
      meta: {
        title: "ZAS Tech — بەھێزکردنی کارەکان بە خزمەتگوزاریی دیجیتاڵی",
        description:
          "ZAS Tech یارمەتی کارەکان دەدات لە نەرمەکاڵا، ماڵپەڕ و ئەپ، زیرەکی دەستکرد، پاراستنی ئۆنلاین، کامێرا زیرەک، و گۆڕینی کار بۆ دیجیتاڵ.",
        ogTitle: "ZAS Tech — خزمەتگوزاری دیجیتاڵ و نوێکاری",
        ogDesc:
          "نەرمەکاڵا، ماڵپەڕ و ئەپ، زیرەکی دەستکرد، ئاسایشی سایبەر، چارەسەری کامێرا، و یارمەتیدانی کارەکەت بۆ دیجیتاڵبوون.",
      },
      skip: "پڕبوونەوە بۆ ناوەڕۆک",
      nav: { home: "سەرەکی", services: "خزمەتگوزارییەکان", about: "دەربارەمان", projects: "پرۆژەکان", contact: "پەیوەندی" },
      aria: {
        logo: "ماڵی ZAS Tech",
        menuOpen: "کردنەوەی لیست",
        menuClose: "داخستنی لیست",
        menuDialog: "لیست",
        highlights: "پێشەکی",
        primaryNav: "سەرەکی",
      },
      mobile: { title: "گەشتن", close: "داخستن" },
      lang: { label: "زمان", en: "English", ku: "کوردی", ar: "عربی" },
      hero: {
        badge: "تەکنەلۆژیا · زیرەکی دەستکرد · پاراستن · گەشەی دیجیتاڵی",
        title1: "بەھێزکردنی کارەکان",
        title2: "بە خزمەتگوزاریی دیجیتاڵیمان",
        intro:
          "ئێمە ئەپ و ماڵپەڕ و نەرمەکاڵا دروست دەکەین؛ زیرەکی دەستکرد زیاد دەکەین کاتێک سوودبەخشە؛ سیستەمەکانتان بە ئاسایشی زیاتر لە ئینتەرنێتدا دەپارێزین؛ کاتێک پێویستە کامێرا و وێنە بەکاردەھێنین. ھەروەھا یارمەتیتان دەدەین کارەکانی ڕۆژانە بگوازنەوە بۆ ئامرازی دیجیتاڵی نوێ — ھەنگاو بە ھەنگاو.",
        cta1: "دەستپێکردن",
        cta2: "خزمەتگوزارییەکان ببینە",
        chip1: "دیجیتاڵبوون",
        chip2: "ئاسایشی زیاتر",
        chip3: "درووستکراو بۆ بەکارھێنانی ڕاستەقینە",
      },
      mockup: {
        preview: "پێشبینین — ئامرازەکانت",
        workspace: "شوێنی کارەکەت",
        subtitle: "نەرمەکاڵا کە لەگەڵ شێوازی کارەکەتدا دەگونجێت",
        aiReady: "ئامادەی زیرەکی دەستکرد",
        speed: "خێرایی",
        fast: "خێرا",
        online: "ئۆنلاین",
        stable: "جێگیر",
        safety: "پاراستن",
        protected: "پارێزراو",
        launch: "ئامادەی بڵاوکردنەوە",
      },
      metrics: {
        title: "بە پێشەکی",
        line: "ئەپەکان · ئاسایشی ئۆنلاین · زیرەکی دەستکرد · کامێرا زیرەک · دیجیتاڵبوون",
        s1: "چارەسەر دەرچوو",
        s2: "سەرەکیترین بوارەکان",
        s3: "پابەندی بە کوالیتی",
      },
      services: {
        kicker: "خزمەتگوزارییەکان",
        title: "چی دەتوانین بۆتان بکەین",
        intro:
          "خزمەتگوزاری ڕوون کە دەتوانیت ھەڵی بژێری — درووستکراوە بۆ کارکردن یەکەوە کاتێک زیاتر لە یەک پێویستتە. پاراستن و کوالیتی گرنگن لە ھەر پرۆژەیەک.",
        soft: {
          tag: "درووستکردن",
          title: "پەرەپێدانی نەرمەکاڵا",
          desc: "نەرمەکاڵای تایبەت کە ئامراز و تیمەکانت دەگەیەنێت: ئەپی ناوخۆیی، یەکگرتنەوە لەگەڵ سیستەمەکانی تر، و کۆد کە بە ئاسانی پارێزراو دەگەڕێتەوە کاتێک گەشە دەکەیت.",
        },
        cyber: {
          tag: "پاراستن",
          title: "ئاسایشی سایبەر",
          desc: "پاراستنی بەھێزتر بۆ زانیاری و ھەژمارەکانت: ڕێکخستنی ئاسایشتر، پشکنینی ژیرانە، و ھەنگاوە کارامەکان کە مەترسی کەم دەکەنەوە بەبێ ڕێگریکردن لە کار.",
        },
        ai: {
          tag: "زیرەکی",
          title: "چارەسەری زیرەکی دەستکرد",
          desc: "زیرەکی دەستکرد کە کات پاشەکەوت دەکات: یارمەتیدەر بۆ ستاف، ڕیزکردن یان تاگکردنی ئۆتۆماتیک، داشبۆردی سادە، و وەڵامی ژیرانە لە زانیارییەکانت.",
        },
        vision: {
          tag: "بینین",
          title: "بینینی کۆمپیوتەری",
          desc: "فێرکردنی کامێرا و وێنە بۆ «بینین» بۆ کارەکەت: دۆزینەوەی شت یان کەموکوڕی، ژماردن، و پشکنین — لە شوێنی کار یان لە ھەور ئەگەر گونجاو بێت.",
        },
        web: {
          tag: "ئەزموون",
          title: "ماڵپەڕ و ئەپی مۆبایل",
          desc: "ماڵپەڕ و ئەپی مۆبایل کە جوانن و بەکارھێنان ئاسانە — بارکردنی خێرا، ڕووخساری ڕوون، و نوێکردنەوەی جێگیر کاتێک پێویستتە.",
        },
      },
      about: {
        kicker: "دەربارەمان",
        title: "تەکنەلۆژیا کارامە، بە ڕوونی ڕوونکراوەتەوە",
        p1: "ZAS Tech بەرھەمی دیجیتاڵ و چارەسەری تەکنەلۆژی دروست دەکات بۆ کارەکان کە ئەنجامێکی متمانەپێکراو دەوێت. بیرۆکەی ئاڵۆز دەگۆڕین بۆ نەرمەکاڵای سادە و کار دەکات — و ھەڵبژاردنەکان بە زمانێکی سادە ڕوون دەکەینەوە، بەبێ زمانێکی ئاڵۆز.",
        p2: "چ کارێکی کۆن نوێ دەکەیتەوە یان کارێکی نوێ دەست پێ دەکەیت، لە یەکەم گفتوگۆ تا بڵاوکردنەوە لەگەڵ تانین: ھەنگاوە ڕوونەکان، کاتی ڕاستەقینە، و بۆشایی بۆ گۆڕانکاری لەگەڵ فێربوون.",
        focusL: "ئێمە تەرکیز دەکەین لەسەر",
        focusB: "ئەپ · زیرەکی دەستکرد · سیستەمی پارێزراو · تەکنەلۆژیای کامێرا · ماڵپەڕ",
        workL: "چۆنیەتی کارکردنمان",
        workB: "نوێکردنەوەی بەردەوام و ئامانجی پێوانەکراو",
        cardTitle: "ئەوەی گرنگە بۆ ئێمە",
        pt1: "متمانەیی — سیستەم کە لە کاتی پێویستدا کار دەکات.",
        pt2: "پاراستن — ڕێکخستنی ئاسایشتر بۆ زانیاری و چوونەژوورەوە.",
        pt3: "پێشکەوتنی جێگیر — بڵاوکردنەوە بەسوود لە کاتی دیاریکراو.",
      },
      projects: {
        kicker: "نموونەکان",
        title: "پرۆژەی نموونەیی",
        intro:
          "جۆری کارەکان کە دەمانگرێت — ناوەکان دەتوانن بگۆڕدرێن بۆ نھێنیاتی. ھەر پرۆژەیەک بە پێداویستی ڕاستەقینی کڕیار دروست دەکرێت.",
        p1: {
          tag: "پلاتفۆرم",
          title: "داشبۆردی کارگێڕی",
          desc: "یەک شاشە بۆ تیمەکەت بۆ بینینی ژمارە زیندووەکان، کێ دەتوانێت چ ببینێت، و ئاگاداری سادە کاتێک شتێک پێویستی بە سەرنجە.",
          foot: "درووستکراوە بە کەڵەکەی ماڵپەڕی نوێ و پەیوەندی پارێزراو لە نێوان خزمەتگوزارییەکان.",
        },
        p2: {
          tag: "بینین",
          title: "پشکنینی کارگە بە کامێرا",
          desc: "پشکنین بە کامێرا لەگەڵ شاشەی پێداچوونەوەی سادە بۆ کەمکردنەوەی ھەڵەی بەتاڵ و چارەسەرکردنی کێشەی ڕاستەقینە.",
          foot: "ڕێکخستنی مۆدێل و ھەنگاوەکانی بڵاوکردنەوەی ئاسایشگر.",
        },
        p3: {
          tag: "پاراستن",
          title: "چوونەژوورەوەی ئاسایشتر بۆ بەرھەمی گەشەکردوو",
          desc: "یاسای سەختتر بۆ ئەوەی کێ دەتوانێت چ ببینێت، بەبێ ئەوەی چوونەژوورەوەی ڕۆژانە ئازاربدەر بێت بۆ کڕیارەکان.",
          foot: "ئەنجام: ئامانجی کەمتر بۆ ھێرشبەر، ھەمان ئەزموونی نەرم بۆ بەکارھێنەر.",
        },
      },
      contact: {
        kicker: "پەیوەندی",
        title: "پەیوەندیمان پێوە بگرە",
        intro:
          "نامەیەکی کورت بنێرە دەربارەی ئەوەی پێویستتە. وەڵام دەدەینەوە لەگەڵ ھەنگاوەکانی دواتر، کاتی گومانڕاو، و چاوەڕوانی ڕاستەقینە — بەبێ فرۆشتنی بە زۆر.",
        name: "ناو",
        email: "ئیمەیڵ",
        details: "وردەکاریی پرۆژە",
        phName: "ناوی تەواو",
        phEmail: "you@organization.com",
        phMsg: "ئەوەی دەتەوێت بەدی بھێنیت، کەی دەتەوێت دەست پێ بکەیت، و ھەر شتێکی تر کە گرنگە.",
        submit: "ناردنی نامە",
        emailUs: "ئیمەیڵ بۆ ئێمە",
        note: "وەڵام دەدەینەوە بە ھەنگاوە ڕوونەکان — بەبێ قسەی بەتاڵ.",
        hp: "ئەمە پڕ مەکەرەوە:",
        asideTitle: "زانیاری پەیوەندی",
        asideIntro: "ئیمەیڵ یان پەیوەندی بۆ پرۆژەی نوێ، پرسیار، یان گفتوگۆیەکی کورت دەربارەی گونجاندن.",
        emailLbl: "ئیمەیڵ",
        phoneLbl: "تەلەفۆن",
        mailBtn: "نامە",
        callBtn: "پەیوەندی",
        availTitle: "پێشوازی لە کارێکی نوێ دەکەین",
        availBody:
          "پێداویستییەکانت بڵێ — لەسەر دەریاسە، خشتە، و پاراستنی زانیاری ڕێک دەکەین پێش دەستپێکردن.",
      },
      footer: {
        tagline: "نەرمەکاڵا، ئەپ، زیرەکی دەستکرد، ئاسایشی ئۆنلاین، کامێرا زیرەک، و یارمەتیدانی دیجیتاڵبوون.",
        rights: "ھەموو مافەکان پارێزراون.",
      },
      thanks: {
        title: "نامە وەرگیرا — ZAS Tech",
        metaDesc: "سوپاس — ZAS Tech نامەکەت وەرگرت.",
        h1: "نامەکەت وەرگیرا",
        p: "وەڵام دەدەینەوە لەگەڵ ھەنگاوە ڕوونەکانی دواتر.",
        home: "گەڕانەوە بۆ سەرەکی",
        email: "ئیمەیڵ ڕاستەوخۆ",
      },
    },

    ar: {
      meta: {
        title: "ZAS Tech — تمكين الشركات بخدماتنا الرقمية",
        description:
          "تساعد ZAS Tech الشركات عبر البرمجيات والمواقع والتطبيقات والذكاء الاصطناعي والأمان على الإنترنت وحلول الكاميرات الذكينة والتحول الرقمي.",
        ogTitle: "ZAS Tech — خدمات رقمية وابتكار",
        ogDesc:
          "برمجيات، مواقع وتطبيقات، ذكاء اصطناعي، أمن سيبراني، حلول تعتمد الكاميرات، ومساعدة عملك على التحول الرقمي.",
      },
      skip: "تخطي إلى المحتوى",
      nav: { home: "الرئيسية", services: "الخدمات", about: "من نحن", projects: "المشاريع", contact: "اتصل بنا" },
      aria: {
        logo: "الصفحة الرئيسية لـ ZAS Tech",
        menuOpen: "فتح القائمة",
        menuClose: "إغلاق القائمة",
        menuDialog: "القائمة",
        highlights: "أبرز النقاط",
        primaryNav: "رئيسي",
      },
      mobile: { title: "التنقل", close: "إغلاق" },
      lang: { label: "اللغة", en: "English", ku: "كوردي", ar: "العربية" },
      hero: {
        badge: "تقنية · ذكاء اصطناعي · أمان · نمو رقمي",
        title1: "تمكين الشركات",
        title2: "بخدماتنا الرقمية",
        intro:
          "نبني التطبيقات والمواقع والبرمجيات الخلفية؛ نضيف الذكاء الاصطناعي حيث يفيد؛ نجعل أنظمتكم أكثر أمانًا على الإنترنت؛ ونستخدم الكاميرات والصور عند الحاجة. كما نساعدكم على نقل العمل اليومي إلى أدوات رقمية حديثة — خطوة بخطوة.",
        cta1: "ابدأ الآن",
        cta2: "استكشف الخدمات",
        chip1: "التحول الرقمي",
        chip2: "أمان أكبر على الإنترنت",
        chip3: "مصمم للاستخدام الفعلي",
      },
      mockup: {
        preview: "معاينة — أدواتك",
        workspace: "مساحة عملك",
        subtitle: "برمجيات تناسب طريقة عملك",
        aiReady: "جاهز للذكاء الاصطناعي",
        speed: "السرعة",
        fast: "سريع",
        online: "متصل",
        stable: "مستقر",
        safety: "الأمان",
        protected: "محمي",
        launch: "جاهز للإطلاق",
      },
      metrics: {
        title: "لمحة سريعة",
        line: "تطبيقات · أمان على الإنترنت · ذكاء اصطناعي · كاميرات ذكية · تحول رقمي",
        s1: "حلول تم تسليمها",
        s2: "مجالات الخدمة الرئيسية",
        s3: "التزام بالجودة",
      },
      services: {
        kicker: "الخدمات",
        title: "ما يمكننا أن نقدمه لك",
        intro:
          "خدمات واضحة يمكنك اختيارها — مصممة لتعمل معًا عندما تحتاج أكثر من واحدة. السلامة والجودة مهمتان في كل مشروع.",
        soft: {
          tag: "البناء",
          title: "تطوير البرمجيات",
          desc: "برمجيات مخصصة تربط أدواتك وفرقك: تطبيقات داخلية، تكامل مع أنظمة أخرى، وشيفرة يسهل صيانتها مع نموك.",
        },
        cyber: {
          tag: "الحماية",
          title: "الأمن السيبراني",
          desc: "حماية أقوى لبياناتك وحساباتك: إعدادات أكثر أمانًا، فحوصات عملية، وخطوات تقلل المخاطر دون تعطيل عملك.",
        },
        ai: {
          tag: "الذكاء",
          title: "حلول الذكاء الاصطناعي",
          desc: "ذكاء اصطناعي يوفر الوقت: مساعدات لفريقك، فرز أو تصنيف تلقائي، لوحات معلومات بسيطة، وإجابات أذكى من بياناتك.",
        },
        vision: {
          tag: "الرؤية",
          title: "الرؤية الحاسوبية",
          desc: "جعل الكاميرات والصور «ترى» لأجل عملك: اكتشاف الأشياء أو العيوب، العدّ، ودعم الفحوصات — محليًا أو عبر السحابة عند الحاجة.",
        },
        web: {
          tag: "التجربة",
          title: "تطبيقات الويب والجوال",
          desc: "مواقع وتطبيقات جوال جميلة وسهلة الاستخدام — تحميل سريع، تخطيط واضح، وتحديثات منتظمة عند الحاجة.",
        },
      },
      about: {
        kicker: "من نحن",
        title: "تقنية عملية، موضحة بوضوح",
        p1: "تبني ZAS Tech منتجات رقمية وحلولًا تقنية للشركات التي تريد نتائج موثوقة. نحوّل الأفكار المعقدة إلى برمجيات بسيطة تعمل — ونوضح الخيارات بلغة بسيطة دون مصطلحات معقدة.",
        p2: "سواء حدّثتم عمليات يدوية قديمة أو بدأتم مشروعًا جديدًا، نبقى معكم من أول محادثة حتى الإطلاق: خطوات واضحة، جداول زمنية واقعية، ومجال للتعديل مع التعلم.",
        focusL: "نركز على",
        focusB: "تطبيقات · ذكاء اصطناعي · أنظمة آمنة · تقنية الكاميرا · مواقع",
        workL: "كيف نعمل",
        workB: "تحديثات منتظمة وأهداف يمكن قياسها",
        cardTitle: "ما يهمنا",
        pt1: "الموثوقية — أنظمة تعمل عندما يعتمد عليها الناس.",
        pt2: "الأمان — إعدادات افتراضية أكثر أمانًا للبيانات وتسجيل الدخول.",
        pt3: "تقدم ثابت — إصدارات مفيدة وفق جدول يمكنك التخطيط له.",
      },
      projects: {
        kicker: "أمثلة",
        title: "مشاريع نموذجية",
        intro:
          "أنواع العمل الذي نقوم به — يمكن تغيير الأسماء لأسباب خصوصية. يُشكَّل كل مشروع حول احتياجات العميل الفعلية.",
        p1: {
          tag: "منصة",
          title: "لوحة عمليات",
          desc: "شاشة واحدة للإدارة لمتابعة الأرقام المباشرة، من يرى ماذا، وتنبيهات بسيطة عند الحاجة.",
          foot: "مبني بتقنيات ويب حديثة واتصالات آمنة بين الخدمات.",
        },
        p2: {
          tag: "الرؤية",
          title: "فحص المصنع بالكاميرات",
          desc: "فحص بالكاميرا مع شاشة مراجعة بسيطة لتقليل الإنذارات الكاذبة ومعالجة المشكلات الحقيقية.",
          foot: "يشمل ضبط النموذج وخطوات إطلاق آمنة.",
        },
        p3: {
          tag: "الأمان",
          title: "تسجيل دخول أكثر أمانًا لمنتج نامٍ",
          desc: "قواعد أشد لمن يصل لماذا، دون جعل تسجيل الدخول اليومي مزعجًا للعملاء.",
          foot: "النتيجة: هدف أصغر للمهاجمين، وتجربة سلسة للمستخدمين.",
        },
      },
      contact: {
        kicker: "اتصل بنا",
        title: "تواصل معنا",
        intro:
          "أرسل رسالة قصيرة عما تحتاجه. سنرد بالخطوات التالية والجدول الزمني التقريبي وتوقعات صادقة — دون ضغط بيع.",
        name: "الاسم",
        email: "البريد الإلكتروني",
        details: "تفاصيل المشروع",
        phName: "اسمك الكامل",
        phEmail: "you@organization.com",
        phMsg: "ما تريد تحقيقه، متى تريد البدء، وأي معلومات أخرى يجب أن نعرفها.",
        submit: "إرسال الرسالة",
        emailUs: "راسلنا بالبريد",
        note: "نرد بخطوات واضحة — دون حشو.",
        hp: "لا تملأ هذا الحقل:",
        asideTitle: "بيانات الاتصال",
        asideIntro: "راسلنا أو اتصل بنا لمشاريع جديدة أو أسئلة أو محادثة سريعة عن الملاءمة.",
        emailLbl: "البريد",
        phoneLbl: "الهاتف",
        mailBtn: "بريد",
        callBtn: "اتصال",
        availTitle: "نستقبل مشاريع جديدة",
        availBody:
          "أخبرنا بما تحتاجه — نتفق على النطاق والجدول وكيف نحمي بياناتك قبل البدء.",
      },
      footer: {
        tagline: "برمجيات، تطبيقات، ذكاء اصطناعي، أمان على الإنترنت، كاميرات ذكية، ومساعدتك على التحول الرقمي.",
        rights: "جميع الحقوق محفوظة.",
      },
      thanks: {
        title: "تم استلام الرسالة — ZAS Tech",
        metaDesc: "شكرًا — استلمت ZAS Tech رسالتك.",
        h1: "تم استلام الرسالة",
        p: "سنرد بخطوات واضحة تالية.",
        home: "العودة إلى الرئيسية",
        email: "البريد مباشرة",
      },
    },
  };

  /**
   * @param {string} lang
   * @param {string} path dot-separated
   */
  function t(lang, path) {
    const keys = path.split(".");
    /** @type {unknown} */
    let cur = STRINGS[lang];
    for (const k of keys) {
      if (cur && typeof cur === "object" && k in /** @type {object} */ (cur)) {
        cur = /** @type {Record<string, unknown>} */ (cur)[k];
      } else {
        cur = undefined;
        break;
      }
    }
    if (typeof cur === "string") return cur;
    cur = STRINGS[DEFAULT_LANG];
    for (const k of keys) {
      if (cur && typeof cur === "object" && k in /** @type {object} */ (cur)) {
        cur = /** @type {Record<string, unknown>} */ (cur)[k];
      } else {
        return path;
      }
    }
    return typeof cur === "string" ? cur : path;
  }

  function getStoredLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "en" || v === "ku" || v === "ar") return v;
    } catch (_) {}
    return DEFAULT_LANG;
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  function applyDocumentLang(lang) {
    const html = document.documentElement;
    html.setAttribute("lang", lang === "ku" ? "ckb" : lang);
    if (lang === "ar" || lang === "ku") {
      html.setAttribute("dir", "rtl");
      document.body.classList.add("zas-rtl");
    } else {
      html.removeAttribute("dir");
      document.body.classList.remove("zas-rtl");
    }
  }

  function applyMeta(lang) {
    if (!document.querySelector("title[data-i18n]")) {
      document.title = t(lang, "meta.title");
    }
    const desc = document.querySelector('meta[name="description"]');
    if (desc && !desc.hasAttribute("data-i18n")) {
      desc.setAttribute("content", t(lang, "meta.description"));
    }
    const ogT = document.querySelector('meta[property="og:title"]');
    if (ogT && !ogT.hasAttribute("data-i18n")) {
      ogT.setAttribute("content", t(lang, "meta.ogTitle"));
    }
    const ogD = document.querySelector('meta[property="og:description"]');
    if (ogD && !ogD.hasAttribute("data-i18n")) {
      ogD.setAttribute("content", t(lang, "meta.ogDesc"));
    }
  }

  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const text = t(lang, key);
      if (el.tagName === "TITLE") {
        el.textContent = text;
        document.title = text;
        return;
      }
      if (el instanceof HTMLMetaElement) {
        el.setAttribute("content", text);
        return;
      }
      el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
      el.placeholder = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key || !(el instanceof HTMLElement)) return;
      el.setAttribute("aria-label", t(lang, key));
    });

    applyMeta(lang);
    applyDocumentLang(lang);

    document.querySelectorAll("[data-lang-current]").forEach((el) => {
      el.textContent = t(lang, `lang.${lang}`);
    });

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      if (!(btn instanceof HTMLElement)) return;
      const isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    window.dispatchEvent(new CustomEvent("zas:languagechange", { detail: { lang } }));
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "ku" && lang !== "ar") return;
    setStoredLang(lang);
    applyTranslations(lang);
  }

  function closeAllLangDropdowns() {
    document.querySelectorAll("[data-lang-dropdown]").forEach((root) => {
      const toggle = root.querySelector("[data-lang-dropdown-toggle]");
      const panel = root.querySelector("[data-lang-dropdown-panel]");
      if (toggle instanceof HTMLElement) toggle.setAttribute("aria-expanded", "false");
      if (panel instanceof HTMLElement) panel.hidden = true;
    });
  }

  function initLangDropdown() {
    document.querySelectorAll("[data-lang-dropdown]").forEach((root) => {
      const toggle = root.querySelector("[data-lang-dropdown-toggle]");
      const panel = root.querySelector("[data-lang-dropdown-panel]");
      if (!(toggle instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;

      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = toggle.getAttribute("aria-expanded") === "true";
        closeAllLangDropdowns();
        if (!wasOpen) {
          toggle.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });

    document.addEventListener("click", () => {
      closeAllLangDropdowns();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllLangDropdowns();
    });

    window.addEventListener("zas:languagechange", () => {
      closeAllLangDropdowns();
    });
  }

  function init() {
    const lang = getStoredLang();
    applyTranslations(lang);
    initLangDropdown();
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const l = btn.getAttribute("data-lang-btn");
        if (l === "en" || l === "ku" || l === "ar") setLang(l);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.ZAS_I18N = { setLang, getLang: getStoredLang, t: (path) => t(getStoredLang(), path) };
})();
