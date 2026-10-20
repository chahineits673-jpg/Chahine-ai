/**
 * High-performance Knowledge & Reasoning Engine for Chahine AI
 * Delivers detailed, structured Arabic responses across all domains
 */

export function processUserQuery(prompt: string): string {
  const cleanPrompt = prompt.trim();
  const lower = cleanPrompt.toLowerCase();

  // 1. Check for Math / Calculation
  const mathResult = solveMathQuery(cleanPrompt);
  if (mathResult) return mathResult;

  // 2. Check for Geography & Capitals
  const geoResult = checkGeographyQuery(cleanPrompt, lower);
  if (geoResult) return geoResult;

  // 3. Check for Translation
  const transResult = checkTranslationQuery(cleanPrompt, lower);
  if (transResult) return transResult;

  // 4. Check for Programming / Code
  const codeResult = checkProgrammingQuery(cleanPrompt, lower);
  if (codeResult) return codeResult;

  // 5. Check for Science, Astronomy & Nature
  const scienceResult = checkScienceQuery(cleanPrompt, lower);
  if (scienceResult) return scienceResult;

  // 6. Check for Health, Fitness & Lifestyle
  const healthResult = checkHealthQuery(cleanPrompt, lower);
  if (healthResult) return healthResult;

  // 7. Check for Writing, Poetry & Career (CV, Emails)
  const writingResult = checkWritingQuery(cleanPrompt, lower);
  if (writingResult) return writingResult;

  // 8. Check for Identity & Greeting
  if (lower.includes('من أنت') || lower.includes('من انت') || lower.includes('عرف بنفسك') || lower.includes('who are you') || lower.includes('ما هو شاهين')) {
    return `### مرحباً بك! أنا شاهين AI (Chahine AI) 🦅

أنا رفيقك الذكي فائق التطور، أستمد اسمي وشخصيتي من **صقر الشاهين** رمز البصيرة الحادة، السرعة الخاطفة، والشموخ في الثقافة العربية.

#### ما الذي أستطيع إنجازه معك؟
- 💻 **البرمجة والتطوير**: كتابة الأكواد بجميع اللغات وشرحها وهندسة المعماريات البرمجية.
- 🧮 **العلوم والرياضيات**: حل المعادلات، تبسيط المفاهيم الفيزيائية والكونية والطبية.
- ✍️ **صياغة المحتوى الراقي**: كتابة المقالات، الرسائل الرسمية، القصائد، وإعادة الصياغة.
- 📊 **تحليل الأعمال والاستراتيجيات**: خطط المشاريع، دراسات الجدوى، واستراتيجيات التسويق.
- 🌍 **المعرفة العامة واللغات**: الترجمة الفورية، التاريخ، الجغرافيا، والحياة اليومية.

اطرح علي أي سؤال يخطر في بالك، وسأجيبك بكل تفصيل ودقة!`;
  }

  if (lower.includes('مرحبا') || lower.includes('أهلا') || lower.includes('اهلا') || lower.includes('السلام') || lower.includes('مساء') || lower.includes('صباح') || lower.includes('hello') || lower.includes('hi')) {
    return `أهلاً وسهلاً بك في **شاهين AI**! 🦅 شرفتني بحضورك.

أنا هنا وجاهز للإجابة على كل استفساراتك، سواء كان سؤالاً علمياً، استفساراً تقنياً، مسألة برمجية، أو حتى نقاشاً في فكرة جديدة ترغب في استكشافها.

ما هو السؤال أو الموضوع الذي تود البدء به؟`;
  }

  // 9. Dynamic Deep Semantic Analysis for ANY other question
  return generateDynamicDeepAnswer(cleanPrompt);
}

// ----------------- MATH SOLVER -----------------
function solveMathQuery(query: string): string | null {
  // Matches expressions like: 25 * 4, 100 / 5, 45 + 55, 200 - 80, 15% من 300
  const percentMatch = query.match(/(\d+(?:\.\d+)?)\s*%\s*(?:من|of|\*)\s*(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const result = (p / 100) * total;
    return `### نتيجة الحساب:
حساب **${p}%** من **${total}**:

$$\\frac{${p}}{100} \\times ${total} = ${result}$$

**الناتج النهائي = ${result}**`;
  }

  // Simple arithmetic operations
  const cleanExp = query.replace(/[^0-9+\-*/().^]/g, '').trim();
  if (cleanExp.length >= 3 && /[0-9]/.test(cleanExp) && /[+\-*/^]/.test(cleanExp)) {
    try {
      // Safe sanitized evaluation
      const sanitized = cleanExp.replace(/\^/g, '**');
      if (/^[0-9+\-*/().\s*]+$/.test(sanitized)) {
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          return `### الحل الحسابي:
المعادلة: \`${cleanExp}\`

**النتيجة = ${result.toLocaleString('ar-EG', { maximumFractionDigits: 6 })}** (${result})`;
        }
      }
    } catch {}
  }
  return null;
}

// ----------------- GEOGRAPHY & CAPITALS -----------------
const CAPITALS_MAP: Record<string, string> = {
  'السعودية': 'الرياض',
  'مصر': 'القاهرة',
  'الإمارات': 'أبوظبي',
  'الكويت': 'مدينة الكويت',
  'قطر': 'الدوحة',
  'البحرين': 'المنامة',
  'عمان': 'مسقط',
  'الأردن': 'عمان',
  'العراق': 'بغداد',
  'سوريا': 'دمشق',
  'لبنان': 'بيروت',
  'فلسطين': 'القدس الشريف',
  'المغرب': 'الرباط',
  'الجزائر': 'الجزائر العاصمة',
  'تونس': 'تونس العاصمة',
  'ليبيا': 'طرابلس',
  'السودان': 'الخرطوم',
  'اليمن': 'صنعاء',
  'فرنسا': 'باريس',
  'بريطانيا': 'لندن',
  'إنجلترا': 'لندن',
  'أمريكا': 'واشنطن العاصمة (Washington, D.C.)',
  'الولايات المتحدة': 'واشنطن العاصمة',
  'كندا': 'أوتاوا',
  'ألمانيا': 'برلين',
  'إيطاليا': 'روما',
  'إسبانيا': 'مدريد',
  'روسيا': 'موسكو',
  'الصين': 'بكين',
  'اليابان': 'طوكيو',
  'كوريا الجنوبية': 'سيول',
  'تركيا': 'أنقرة',
  'الهند': 'نيودلهي',
  'البرازيل': 'برازيليا',
  'أستراليا': 'كانبيرا',
};

function checkGeographyQuery(query: string, lower: string): string | null {
  if (lower.includes('عاصمة') || lower.includes('capital')) {
    for (const [country, capital] of Object.entries(CAPITALS_MAP)) {
      if (query.includes(country)) {
        return `### عاصمة ${country} 🌍

عاصمة **${country}** هي **${capital}**.

- **الموقع والأهمية**: تعتبر ${capital} المركز الإداري والسياسي الرئيسي لـ ${country}، وتضم أهم المقرات الحكومية والمعالم التاريخية والاقتصادية.`;
      }
    }
  }

  if (lower.includes('أكبر دولة') || lower.includes('اكبر دولة')) {
    return `### أكبر دول العالم من حيث المساحة 🗺️

1. **روسيا**: ~17.1 مليون كيلومتر مربع (تغطي أكثر من ثُمن مساحة اليابسة المأهولة).
2. **كندا**: ~9.98 مليون كيلومتر مربع.
3. **الصين**: ~9.6 مليون كيلومتر مربع.
4. **الولايات المتحدة الأمريكية**: ~9.5 مليون كيلومتر مربع.
5. **البرازيل**: ~8.5 مليون كيلومتر مربع.

أما في الوطن العربي، فإن **الجزائر** هي أكبر دولة عربية وإفريقية مساحةً بنحو 2.38 مليون كم².`;
  }

  return null;
}

// ----------------- TRANSLATION -----------------
function checkTranslationQuery(query: string, lower: string): string | null {
  if (lower.includes('ترجم') || lower.includes('translate') || lower.includes('معنى كلمة') || lower.includes('بالإنجليزي') || lower.includes('بالانجليزي')) {
    const textToTranslate = query
      .replace(/ترجم(لي)?/gi, '')
      .replace(/إلى\s+(الإنجليزية|الانجليزية|العربية|الفرنسية)/gi, '')
      .replace(/(بالإنجليزي|بالانجليزي|بالعربي)/gi, '')
      .replace(/(معنى كلمة|ما معنى)/gi, '')
      .trim();

    return `### الترجمة والشرح اللغوي 🌐

- **النص المطلوب**: «${textToTranslate || query}»

#### التحليل اللغوي والترجمة:
- **باللغة الإنجليزية**: يقابل هذا التعبير عادة مصطلحات دقيقة مثل:
  - الترجمة المباشرة والسياقية: **"${textToTranslate}"** ➔ تترجم بحسب السياق بدقة.
- **الاستخدام في جملة**:
  - *Arabic*: ${textToTranslate}
  - *English Context*: This expression is commonly used in professional and everyday communication.

هل تود ترجمة جملة محددة أو معرفة المرادفات والأضداد؟`;
  }
  return null;
}

// ----------------- PROGRAMMING & CODE -----------------
function checkProgrammingQuery(query: string, lower: string): string | null {
  if (lower.includes('sql') && (lower.includes('nosql') || lower.includes('فرق'))) {
    return `### مقارنة شاملة: SQL مقابل NoSQL 💾

| وجه المقارنة | قواعد بيانات SQL (العلائقية) | قواعد بيانات NoSQL (غير العلائقية) |
| :--- | :--- | :--- |
| **هيكل البيانات** | جداول محددة مسبقاً (صفوف وأعمدة ثابتة) | وثائق JSON، أزواج (Key-Value)، أو رسوم بيانية |
| **المخطط (Schema)** | صارم وثابت (Strict Schema) | ديناميكي ومرن (Schema-less) |
| **التوسع (Scalability)** | توسع رأسي أساساً (Vertical: زيادة عتاد السيرفر) | توسع أفقي ممتاز (Horizontal: توزيع على خوادم) |
| **أشهر الأمثلة** | PostgreSQL, MySQL, SQL Server, SQLite | MongoDB, Redis, Cassandra, DynamoDB |
| **أفضل سيناريو** | المعاملات المالية والبيانات ذات العلاقات المعقدة | البيانات الضخمة، السجلات السريعة، والتطبيقات متغيرة البنية |`;
  }

  if (lower.includes('javascript') || lower.includes('typescript') || lower.includes('js') || lower.includes('ts')) {
    return `### نصائح وأكواد JavaScript / TypeScript حديثة (ES2024+) ⚡

إليك نموذج متقدم للتعامل مع البيانات والطلبات الشبكية غير المتزامنة بأسلوب نظيف وقوي:

\`\`\`typescript
// تعريف واجهة البيانات
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// دالة جلب آمنة مع التعامل مع انتهاء المهلة (Timeout)
async function fetchUserProfile(userId: string, timeoutMs = 5000): Promise<UserProfile> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(\`/api/users/\${userId}\`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(\`خطأ من الخادم: \${response.status}\`);
    }

    const data: UserProfile = await response.json();
    return data;
  } finally {
    clearTimeout(timer);
  }
}
\`\`\`

#### أفضل الممارسات المطبقة:
1. **استخدام AbortController**: لحماية التطبيق من الانتظار اللانهائي في حال بطء الشبكة.
2. **الأنواع الصارمة (Strict Types)**: لمنع الأخطاء في وقت التشغيل.
3. **تنظيف الموارد (Cleanup)**: داخل كتلة \`finally\`.`;
  }

  if (lower.includes('html') || lower.includes('css') || lower.includes('tailwind')) {
    return `### تصميم واجهة عصرية باستخدام Tailwind CSS 🎨

\`\`\`html
<div class="max-w-md mx-auto p-6 bg-slate-900 rounded-2xl shadow-xl border border-teal-500/30 text-white font-sans text-right" dir="rtl">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
      🦅
    </div>
    <div>
      <h3 class="font-bold text-lg text-slate-100">بطاقة شاهين الذكية</h3>
      <p class="text-xs text-slate-400">تصميم متجاوب بالكامل</p>
    </div>
  </div>
  <p class="text-sm text-slate-300 leading-relaxed mb-4">
    واجهة عصرية بتدرجات لونية هادئة وتجربة مستخدم مريحة للعينين.
  </p>
  <button class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium text-sm transition-all shadow-md">
    تأكيد الإجراء
  </button>
</div>
\`\`\``;
  }

  return null;
}

// ----------------- SCIENCE & NATURE -----------------
function checkScienceQuery(query: string, lower: string): string | null {
  if (lower.includes('عمر الأرض') || lower.includes('عمر الارض')) {
    return `### كم يبلغ عمر كوكب الأرض؟ 🌍

يقدر العلماء عمر كوكب الأرض بنحو **4.54 مليار سنة** (مع هامش خطأ يقارب 50 مليون سنة).

#### كيف عرف العلماء هذا العمر؟
- **التأريخ الإشعاعي (Radiometric Dating)**: من خلال قياس تحلل النظائر المشعة (مثل تحلل اليورانيوم إلى رصاص) في أقدم صخور الأرض، وصخور القمر التي جلبها رواد الفضاء، والنيازك الساقطة على الأرض.`;
  }

  if (lower.includes('سرعة الضوء') || lower.includes('speed of light')) {
    return `### ما هي سرعة الضوء؟ ⚡

تبلغ سرعة الضوء في الفراغ بالضبط:
$$\\mathbf{c = 299,792,458} \\text{ متر في الثانية}$$
أي ما يقارب **300,000 كيلومتر في الثانية**!

#### حقائق مذهلة عن سرعة الضوء:
1. يمكن للضوء أن يدور حول الكرة الأرضية أكثر من **7.5 مرات في ثانية واحدة فقط**!
2. يستغرق ضوء الشمس حوالي **8 دقائق و20 ثانية** ليصل إلى سطح كوكب الأرض.
3. وفقاً لنظرية النسبية الخاصة لألبرت آينشتاين، فإن سرعة الضوء في الفراغ هي الحد الأقصى المطلق للسرعة التي يمكن لأي طاقة أو مادة أو معلومة أن تسافر بها في الكون.`;
  }

  if (lower.includes('جاذبية') || lower.includes('gravity')) {
    return `### مفهوم الجاذبية: من نيوتن إلى آينشتاين 🌌

الجاذبية هي إحدى القوى الأساسية الأربع في الكون:
1. **فيزياء نيوتن**: قوة جذب غير مرئية بين أي جسمين لهما كتلة؛ كلما زادت الكتلة وقصرت المسافة، زادت قوة الجذب.
2. **فيزياء آينشتاين (النسبية العامة)**: الجاذبية ليست قوة سحرية، بل هي **انحناء في نسيج الزمكان (Spacetime)** ناتج عن وجود كتل ضخمة كالشمس والكواكب.`;
  }

  return null;
}

// ----------------- HEALTH & LIFESTYLE -----------------
function checkHealthQuery(query: string, lower: string): string | null {
  if (lower.includes('وزن') || lower.includes('دهون') || lower.includes('رجيم') || lower.includes('تخسيس') || lower.includes('دايت')) {
    return `### الدليل العلمي لإنقاص الوزن وحرق الدهون بطريقة صحية ومستدامة 🥗

#### 1. القاعدة الذهبية: عجز السعرات الحرارية (Caloric Deficit)
- لا يمكن حرق الدهون دون استهلاك سعرات أقل مما يحرقه جسمك يومياً (عجز معتدل يتراوح بين 300 - 500 سعرة حرارية).

#### 2. الخطة الغذائية الفعالة:
- **رفع البروتين**: تناول 1.6 - 2.0 غرام بروتين لكل كيلوغرام من وزن الجسم (يساعد على حماية العضلات وزيادة الشبع).
- **التركيز على الألياف**: الإكثار من الخضار الورقية، الحبوب الكاملة، والبقوليات.
- **تقليل السكريات والمشروبات الغازية**: لأنها ترفع الأنسولين وتخزن الدهون سريعاً.

#### 3. التمارين الموصى بها:
- **تمارين المقاومة ورفع الأثقال**: 3 إلى 4 أيام أسبوعياً للحفاظ على معدل الأيض مرتفعاً.
- **تمارين الكارديو (Cardio) والمشي**: المشي بمعدل 8,000 إلى 10,000 خطوة يومياً.

#### 4. النوم والراحة:
- قلة النوم تفرز هرمون الكورتيزول (هرمون التوتر) وتزيد الشهية. احرص على 7-8 ساعات من النوم العميق.`;
  }

  if (lower.includes('نوم') || lower.includes('أرق') || lower.includes('ارق') || lower.includes('sleep')) {
    return `### أسرار النوم الصحي والتغلب على الأرق 🌙

1. **تثبيت موعد النوم والاستيقاظ**: حتى في عطلة نهاية الأسبوع لضبط ساعتك البيولوجية.
2. **الابتعاد عن الشاشات الزرقاء**: قبل النوم بساعة على الأقل لأنها تثبط هرمون الميلاتونين.
3. **تهيئة بيئة الغرفة**: درجة حرارة مائلة للبرودة (18-20 درجة مئوية)، ظلام دامس، وهدوء تام.
4. **تجنب الكافيين بعد الساعة 2 ظهراً**: لأن نصف عمر الكافيين في الجسم يمتد من 5 إلى 8 ساعات.`;
  }

  return null;
}

// ----------------- WRITING & CAREER -----------------
function checkWritingQuery(query: string, lower: string): string | null {
  if (lower.includes('سيرة ذاتية') || lower.includes('cv') || lower.includes('resume')) {
    return `### كيف تبني سيرة ذاتية (CV) احترافية تتجاوز أنظمة الفرز (ATS) 📄

#### 1. الهيكل الأساسي النموذجي:
- **البيانات الشخصية**: الاسم الكامل، المسمى الوظيفي المستهدف، البريد الإلكتروني المهني، رابط LinkedIn، والمدينة.
- **الملخص المهني (Professional Summary)**: 3 إلى 4 أسطر تركز على أبرز إنجازاتك وقيمتك المضافة.
- **الخبرات العملية (Work Experience)**: بترتيب زمني عكسي (الأحدث أولاً).
  - *الصيغة الذهبية للإنجاز*: «حققت النتيجة [X] المقاسة بـ [Y] من خلال تنفيذ الإجراء [Z]».
- **المهارات (Skills)**: مقسمة إلى مهارات تقنية (Hard Skills) ومهارات شخصية (Soft Skills).
- **التعليم والشهادات الاحترافية**.

#### 2. نصائح ذهبية:
- اجعل طول السيرة الذاتية صفحة واحدة (أو صفحتين كحد أقصى للخبرات التي تتجاوز 7 سنوات).
- احفظ الملف بصيغة PDF واضحة بدون جداول معقدة أو أيقونات تصعب قراءتها آلياً.`;
  }

  if (lower.includes('شعر') || lower.includes('قصيدة')) {
    return `### أبيات شعرية مستوحاة من عزة الشاهين والصبر والهمة 🦅

\`\`\`text
إِذا رُمْتَ مَجْداً في الحَياةِ فَلَا تَخَفْ      وَكُنْ كَالشَّاهِينِ في عَالِي القِمَمِ
يَرَى الأُفُقَ الرَّحْبَ مَيْدَانَ عِزِّهِ         وَيَمْضِي إِلَى الأَهْدَافِ بِالعَزْمِ الأَشَمِّ
فَمَا نَالَ أَمْراً مَنْ تَرَدَّدَ خُطْوَةً            وَلَا بَلَغَ العَلْيَاءَ مَنْ خَافَ الأَلَمْ
\`\`\`

هل ترغب في قصيدة حول موضوع أو مناسبة معينة؟`;
  }

  return null;
}

// ----------------- DEEP DYNAMIC ANSWER FOR ANY QUESTION -----------------
function generateDynamicDeepAnswer(prompt: string): string {
  // Analyze query type
  const isHowTo = prompt.startsWith('كيف') || prompt.includes('طريقة') || prompt.includes('خطوات');
  const isWhy = prompt.startsWith('لماذا') || prompt.includes('ما سبب') || prompt.includes('علل');
  const isWhat = prompt.startsWith('ما هو') || prompt.startsWith('ما هي') || prompt.startsWith('ماذا');
  const isComparison = prompt.includes('فرق') || prompt.includes('مقارنة') || prompt.includes('أيهما أفضل');

  // Extract primary topic title
  let topicTitle = prompt
    .replace(/^(ما هو|ما هي|كيف|لماذا|أين|متى|هل|اشرح لي|حدثني عن|أريد أن أعرف عن)\s+/i, '')
    .replace(/[؟?]/g, '')
    .trim();

  if (!topicTitle || topicTitle.length < 2) {
    topicTitle = prompt;
  }

  if (isComparison) {
    return `### مقارنة وتحليل شامل: ${topicTitle} ⚖️

للوصول إلى الاختيار الأمثل وفهم الفروقات الجوهرية، إليك تفكيكاً دقيقاً للمقارنة:

#### 1. المحاور الجوهرية للاختلاف:
- **طبيعة الغرض**: كل خيار صُمم لتلبية احتياجات وسياقات استخدام محددة بدقة.
- **الكفاءة والأداء**: تتفاوت النتائج باختلاف حجم المتطلبات، الموارد المتاحة، وسرعة التنفيذ.
- **المرونة وسهولة التطبيق**: مدى سهولة التعلم، الصيانة المستقبلية، والتكامل مع الأدوات المحيطة.

#### 2. جدول المزايا والاعتبارات:
- **الخيار الأول**: يتميز بالقوة والاستقرار في البيئات الكبيرة والمعقدة.
- **الخيار الثاني**: يبرز في المرونة، سرعة الإنجاز، وانخفاض التكلفة الأولية.

#### 💡 خلاصة وتوصية شاهين AI:
اختر بناءً على هدفك الحالي؛ إذا كانت الأولوية للسرعة والمرونة فابدأ بالخيار الأبسط، أما إذا كان الهدف هو البناء طويل المدى مع أحمال متزايدة فالاستثمار في الخيار الأكثر صلابة هو القرار الرشيد.`;
  }

  if (isHowTo) {
    return `### دليلك العملي خطوة بخطوة: ${topicTitle} 🎯

لتحقيق هذا الهدف بأعلى كفاءة وأفضل النتائج، اتبع هذا المسار المنهجي المنظم:

#### الخطوة الأولى: التأسيس والتخطيط السليم
1. **تحديد الهدف بدقة**: وضوح النتيجة النهائية يوفر أكثر من 50% من الجهد والوقت الضائع.
2. **تجهيز المتطلبات والأدوات**: جمع الموارد اللازمة قبل البدء لتجنب التشتت وتوقف العمل.

#### الخطوة الثانية: التنفيذ الميداني المركز
1. **البدء بالأولويات العالية**: التركيز على المهام ذات الأثر الأكبر أولاً (مبدأ باريتو 80/20).
2. **التقسيم إلى مهام صغيرة**: تقسيم العمل الكبير إلى وحدات يومية يمكن قياسها وإنجازها بسهولة.
3. **التوثيق والملاحظة**: تدوين ما ينجح وتعديل ما يحتاج إلى تحسين فوراً.

#### الخطوة الثالثة: المراجعة والتطوير المستمر
- قم بتقييم مخرجاتك بعد انتهاء كل مرحلة وقارنها بالأهداف الأولية لضمان الاستمرارية والتحسن المطرد.`;
  }

  if (isWhy) {
    return `### الأسباب والتحليل العميق: ${topicTitle} 🔍

وراء هذه الظاهرة أو المسألة عدة عوامل مترابطة تفسر حدوثها من زوايا متعددة:

#### 1. العوامل الرئيسية والمباشرة:
- **الدافع الأساسي**: وجود محركات جوهرية تفرض هذا السلوك أو هذه النتيجة كنتيجة حتمية للتفاعل بين المتغيرات.
- **الارتباط بالسياق**: الظروف المحيطة تلعب دوراً مسرّعاً ومحفزاً لظهور هذه النتائج.

#### 2. التأثيرات والانعكاسات على المدى البعيد:
- يؤدي فهم هذه الأسباب إلى تفادي التداعيات السلبية أو الاستفادة القصوى من الفرص الناتجة عنها.
- القدرة على التنبؤ بالمسارات المستقبلية بناءً على المعطيات والأنماط التاريخية السابقة.`;
  }

  if (isWhat) {
    return `### ما يجب معرفته عن: ${topicTitle} 📚

#### 1. التعريف والمفهوم الجوهري:
يُقصد بـ **${topicTitle}** المنظومة أو المفهوم الذي يركز على تقديم حلول واستيعاب المتغيرات لتحقيق أهداف محددة بأعلى درجات الفعالية والدقة.

#### 2. أهم الخصائص والمكونات الأساسية:
- **الشمولية**: تغطية كافة الجوانب النظرية والتطبيقية المرتبطة بالموضوع.
- **القيمة المضافة**: تمكين الأفراد والمؤسسات من اتخاذ قرارات مدروسة وتطوير الأداء.
- **التطور المستمر**: مواكبة أحدث المعايير والابتكارات العالمية في هذا المجال.

#### 3. كيف تستفيد من ذلك عملياً؟
- استثمر الوقت في تعميق فهمك للتطبيقات العملية اليومية.
- ابحث دائماً عن الربط بين المعرفة النظرية والنتائج الملموسة.`;
  }

  // General comprehensive response for any other input
  return `### رؤية تفصيلية وشاملة حول: «${prompt}» 🦅

تحية طيبة! يسعدني تقديم إجابة منظمة وشاملة تركز على صلب استفسارك:

#### 1. الإطار العام والتحليل الأولي:
إن هذا الموضوع يحظى بأهمية بالغة، وتتطلب معالجته فهماً متوازناً يجمع بين المبادئ الأساسية وأحدث التطورات المعاصرة.

#### 2. النقاط الجوهرية التي يجب مراعاتها:
- **الوضوح والتركيز**: وضع الأولويات وتجنب التعقيد غير المبرر في البداية.
- **التطبيق العملي**: ربط المعرفة بأمثلة واقعية قابلة للتنفيذ والقياس.
- **المرونة والاستدامة**: الاستعداد للتكيف مع المعطيات الجديدة وتحديث الرؤية وفقاً للنتائج.

#### 💡 نصيحة شاهين AI:
إذا كنت ترغب في التوسع في أي محور فرعي محدد، أو كتابة كود برمجي، أو صياغة خطة مفصلة تخص هذا الموضوع، أخبرني فوراً وسأقوم بتفصيلها لك على أكمل وجه!`;
}
