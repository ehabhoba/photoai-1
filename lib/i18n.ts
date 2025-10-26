/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

type Language = 'ar' | 'en';

const decadePrompts = {
    '1950s': {
        en: "A photorealistic image of the person in the style of a 1950s photograph. Capture the post-war optimism. Use the aesthetic of a classic Kodachrome or Ektachrome film, with rich, saturated colors. The person should have a popular 1950s hairstyle (e.g., pompadour, slicked back for men; poodle cuts, bouffant for women) and wear classic 1950s fashion (e.g., leather jackets, cuffed jeans, letterman sweaters for men; full-skirted dresses, cardigans for women). The setting could be a classic diner or a suburban street with vintage cars. The final image must be high-quality and look like a genuine photograph from the 1950s.",
        ar: "صورة واقعية للشخص بأسلوب الخمسينات. التقط تفاؤل ما بعد الحرب. استخدم جمالية فيلم كوداكروم أو إكتاكروم الكلاسيكي، بألوان غنية ومشبعة. يجب أن يكون للشخص تسريحة شعر شهيرة في الخمسينات (مثل بومبادور، الشعر المرجع للخلف للرجال؛ قصة البودل، بوفان للنساء) ويرتدي أزياء الخمسينات الكلاسيكية (مثل السترات الجلدية، الجينز المثني، سترات ليترمان للرجال؛ الفساتين ذات التنانير الكاملة، الكارديجان للنساء). يمكن أن يكون المكان مطعمًا كلاسيكيًا أو شارعًا في الضواحي به سيارات قديمة. يجب أن تكون الصورة النهائية عالية الجودة وتبدو كصورة حقيقية من الخمسينات.",
    },
    '1960s': {
        en: "A photorealistic image of the person reimagined in the 1960s. Capture the spirit of the counter-culture revolution. The photo could be a grainy, high-contrast black and white shot like a reportage photo, or a vibrant, saturated color photo reminiscent of the swinging '60s. The person should have a 1960s hairstyle (e.g., mop-top, long hair for men; beehive, bob cuts for women) and wear mod or hippie fashion (e.g., tailored suits, turtlenecks for mods; tie-dye, bell-bottoms, fringe vests for hippies). The setting could be a music festival or a pop art-inspired studio. The final image must be high-quality and feel authentic to the 1960s.",
        ar: "صورة واقعية للشخص معادة تصوره في الستينات. التقط روح ثورة الثقافة المضادة. يمكن أن تكون الصورة بالأبيض والأسود، محببة وعالية التباين مثل صور الريبورتاج، أو صورة ملونة زاهية ومشبعة تذكرنا بالستينات الصاخبة. يجب أن يكون للشخص تسريحة شعر من الستينات (مثل الموب-توب، الشعر الطويل للرجال؛ خلية النحل، قصات البوب للنساء) ويرتدي أزياء المود أو الهيبيز (مثل البدلات المصممة، الياقات المدورة للمود؛ الصبغة المربوطة، سراويل الجرس، سترات الأهداب للهيبيز). يمكن أن يكون المكان مهرجانًا موسيقيًا أو استوديو مستوحى من فن البوب. يجب أن تكون الصورة النهائية عالية الجودة وأصيلة للستينات.",
    },
    '1970s': {
        en: "A photorealistic image of the person in the style of a 1970s photograph. Capture the essence of the disco and folk era. The image should have a warm, soft-focus look, possibly with some lens flare, typical of photos from this decade. Use a color palette rich in earth tones (browns, oranges, yellows). The person should have a 1970s hairstyle (e.g., long hair with sideburns, afros for men; feathered hair, shag cuts for women) and wear iconic 1970s fashion (e.g., bell-bottom jeans, wide-collar shirts, platform shoes). The setting could be a disco, a roller rink, or a wood-paneled living room. The final image must look like a genuine photograph from a 1970s Polaroid or Instamatic camera.",
        ar: "صورة واقعية للشخص بأسلوب السبعينات. التقط جوهر عصر الديسكو والفولك. يجب أن يكون للصورة مظهر دافئ وناعم البؤرة، وربما مع بعض توهج العدسة، وهو أمر نموذجي لصور هذا العقد. استخدم لوحة ألوان غنية بدرجات الألوان الترابية (البني، البرتقالي، الأصفر). يجب أن يكون للشخص تسريحة شعر من السبعينات (مثل الشعر الطويل مع السوالف، الأفرو للرجال؛ الشعر ذو الطبقات، قصات الشاج للنساء) ويرتدي أزياء السبعينات الشهيرة (مثل جينز الجرس، القمصان ذات الياقات العريضة، الأحذية ذات النعل السميك). يمكن أن يكون المكان ديسكو، أو حلبة تزلج، أو غرفة معيشة ذات ألواح خشبية. يجب أن تبدو الصورة النهائية كصورة حقيقية من كاميرا بولارويد أو إنستاماتيك في السبعينات.",
    },
    '1980s': {
        en: "A photorealistic image of the person reimagined in the 1980s. Capture the 'era of excess' with bold styles and vibrant colors. The photograph should have a sharp, slightly glossy look, possibly with the harsh, direct flash common in 80s photography. The person should have a classic 80s hairstyle (e.g., mullet, jheri curls, new wave spikes for men; big permed hair, side ponytails for women) and wear 80s fashion (e.g., neon colors, shoulder pads, acid-wash jeans, tracksuits). The setting could be an arcade, a shopping mall, or against a laser grid background for a glamour shot. The final image must be high-quality and perfectly capture the 80s aesthetic.",
        ar: "صورة واقعية للشخص معادة تصوره في الثمانينات. التقط 'عصر الإفراط' بأساليب جريئة وألوان زاهية. يجب أن يكون للصورة مظهر حاد ولامع قليلاً، وربما مع الفلاش المباشر والقاسي الشائع في تصوير الثمانينات. يجب أن يكون للشخص تسريحة شعر كلاسيكية من الثمانينات (مثل الموليت، تجعيد جيري، تسريحات الموجة الجديدة للرجال؛ الشعر الكبير المجعد، ذيل الحصان الجانبي للنساء) ويرتدي أزياء الثمانينات (مثل ألوان النيون، حشوات الأكتاف، جينز الغسيل الحمضي، البدلات الرياضية). يمكن أن يكون المكان صالة ألعاب فيديو، أو مركز تسوق، أو أمام خلفية شبكة ليزر لقطة ساحرة. يجب أن تكون الصورة النهائية عالية الجودة وتجسد جمالية الثمانينات بشكل مثالي.",
    },
    '1990s': {
        en: "A photorealistic image of the person in the style of a 1990s snapshot. Capture the grunge, hip-hop, or pop aesthetic of the decade. The photo should have the look of being taken with a 35mm point-and-shoot film camera, with slightly muted or faded colors and natural lighting. The person should have a popular 90s hairstyle (e.g., curtains, bowl cut, frosted tips for men; 'The Rachel' haircut, high ponytails, scrunchies for women) and wear 90s fashion (e.g., flannel shirts, baggy jeans, sportswear, Doc Martens). The setting could be a skate park, a bedroom with band posters, or a suburban street. The final image should feel like a genuine, candid photo from the 1990s.",
        ar: "صورة واقعية للشخص بأسلوب لقطة من التسعينات. التقط جمالية الجرونج، أو الهيب هوب، أو البوب في ذلك العقد. يجب أن تبدو الصورة وكأنها التقطت بكاميرا فيلم 35 مم، بألوان باهتة قليلاً وإضاءة طبيعية. يجب أن يكون للشخص تسريحة شعر شهيرة في التسعينات (مثل الستائر، قصة الوعاء، الأطراف الملونة للرجال؛ قصة 'رايتشل'، ذيل الحصان العالي، ربطات الشعر للنساء) ويرتدي أزياء التسعينات (مثل قمصان الفلانيل، الجينز الفضفاض، الملابس الرياضية، أحذية دوك مارتنز). يمكن أن يكون المكان حديقة تزلج، أو غرفة نوم بها ملصقات فرق موسيقية، أو شارع في الضواحي. يجب أن تبدو الصورة النهائية كصورة عفوية وحقيقية من التسعينات.",
    },
    '2000s': {
        en: "A photorealistic image of the person reimagined in the 2000s. Capture the Y2K and pop-punk vibe. The photograph should look like it was taken with an early digital camera, with slightly lower resolution, harsh on-camera flash, and maybe some slight pixelation or color artifacts. The person should have a 2000s hairstyle (e.g., spiky hair, faux hawk for men; chunky highlights, straight ironed hair for women) and wear iconic 2000s fashion (e.g., low-rise jeans, trucker hats, cargo pants, pop-punk band t-shirts). The setting could be a house party or a hangout spot, captured in a candid, snapshot style. The final image must perfectly emulate the look of a typical digital photo from the early to mid-2000s.",
        ar: "صورة واقعية للشخص معادة تصوره في الألفينات. التقط أجواء Y2K والبوب-بانك. يجب أن تبدو الصورة وكأنها التقطت بكاميرا رقمية مبكرة، بدقة أقل قليلاً، وفلاش قاسٍ على الكاميرا، وربما بعض البكسلة الطفيفة أو عيوب الألوان. يجب أن يكون للشخص تسريحة شعر من الألفينات (مثل الشعر الشائك، الفو هوك للرجال؛ الخصلات العريضة، الشعر المفرود بالمكواة للنساء) ويرتدي أزياء الألفينات الشهيرة (مثل الجينز منخفض الخصر، قبعات سائقي الشاحنات، سراويل الكارغو، قمصان فرق البوب-بانك). يمكن أن يكون المكان حفلة منزلية أو مكان للتجمع، ملتقط بأسلوب عفوي. يجب أن تحاكي الصورة النهائية بشكل مثالي مظهر صورة رقمية نموذجية من أوائل إلى منتصف الألفينات.",
    },
};


const translationData = {
    ar: {
        title: 'رحلة عبر الزمن',
        subtitle: 'شاهد نفسك عبر العقود.',
        uploadInstructions: 'انقر على الصورة لتحميل صورتك وبدء رحلتك عبر الزمن.',
        freeMessage: 'مجاني تمامًا. لا يتطلب تسجيل. بدون فترة تجريبية.',
        filterTitle: 'اختر فلترًا',
        generatePrompt: (decade: string) => {
            const prompts = decadePrompts[decade as keyof typeof decadePrompts];
            return prompts ? prompts.ar : `أعد تصور الشخص في هذه الصورة بأسلوب عقد ${decade}. يجب أن يشمل هذا الملابس، تسريحة الشعر، جودة الصورة، والجمالية العامة لذلك العقد. يجب أن يكون الناتج صورة واقعية تظهر الشخص بوضوح.`;
        },
        buttons: {
            differentPhoto: 'صورة مختلفة',
            generate: 'إنشاء',
            shareResults: 'مشاركة النتائج',
            readyPrompts: 'مطالبات جاهزة',
            downloadAlbum: 'تحميل الألبوم',
            creatingAlbum: 'جاري إنشاء الألبوم...',
            startOver: 'البدء من جديد',
        },
        polaroid: {
            clickToStart: 'انقر للبدء',
            yourPhoto: 'صورتك',
            uploadPlaceholder: 'تحميل صورة',
        },
        filters: {
            noFilter: 'بدون فلتر',
            sepia: 'سيبيا',
            bw: 'أبيض وأسود',
            vintage: 'فينتاج',
        },
        alerts: {
            filterError: 'لا يمكن تطبيق الفلتر المحدد. سيتم المتابعة بالصورة الأصلية.',
            waitAllImages: 'يرجى الانتظار حتى تنتهي جميع الصور من التحميل قبل تنزيل الألبوم.',
            albumError: 'عذرًا، حدث خطأ أثناء إنشاء ألبومك. يرجى المحاولة مرة أخرى.',
        },
        promptModal: {
            title: 'مطالبات جاهزة للإلهام',
            closeAriaLabel: 'إغلاق',
            copy: 'نسخ',
            copied: 'تم النسخ!',
            copyAriaLabel: 'نسخ المطالبة',
        },
        footer: {
            developedBy: 'تم التطوير بواسطة',
        },
        share: {
            title: 'رحلة عبر الزمن بالذكاء الاصطناعي',
            text: 'لقد سافرت عبر الزمن! شاهد صوري من عقود مختلفة تم إنشاؤها بواسطة الذكاء الاصطناعي.',
            alert: 'تم نسخ الرابط! شاركه مع أصدقائك.',
        },
        album: {
            header: 'تم إنشاؤه بواسطة رحلة عبر الزمن',
            subheader: 'على Google AI Studio',
        },
    },
    en: {
        title: 'Past Forward',
        subtitle: 'See yourself through the decades.',
        uploadInstructions: 'Click the polaroid to upload your photo and begin your time travel.',
        freeMessage: 'Completely free. No registration required. No trial period.',
        filterTitle: 'Choose a Filter',
        generatePrompt: (decade: string) => {
            const prompts = decadePrompts[decade as keyof typeof decadePrompts];
            return prompts ? prompts.en : `Reimagine the person in this photo in the style of the ${decade}. This includes clothing, hairstyle, photo quality, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.`;
        },
        buttons: {
            differentPhoto: 'Different Photo',
            generate: 'Generate',
            shareResults: 'Share Results',
            readyPrompts: 'Ready Prompts',
            downloadAlbum: 'Download Album',
            creatingAlbum: 'Creating Album...',
            startOver: 'Start Over',
        },
        polaroid: {
            clickToStart: 'Click to Start',
            yourPhoto: 'Your Photo',
            uploadPlaceholder: 'Upload Photo',
        },
        filters: {
            noFilter: 'No Filter',
            sepia: 'Sepia',
            bw: 'B & W',
            vintage: 'Vintage',
        },
        alerts: {
            filterError: 'Could not apply the selected filter. Proceeding with the original image.',
            waitAllImages: 'Please wait for all images to finish generating before downloading the album.',
            albumError: 'Sorry, there was an error creating your album. Please try again.',
        },
        promptModal: {
            title: 'Ready Prompts for Inspiration',
            closeAriaLabel: 'Close',
            copy: 'Copy',
            copied: 'Copied!',
            copyAriaLabel: 'Copy prompt',
        },
        footer: {
            developedBy: 'Developed by',
        },
        share: {
            title: 'AI Time Travel',
            text: 'I traveled through time! Check out my photos from different decades generated by AI.',
            alert: 'Link copied! Share it with your friends.',
        },
        album: {
            header: 'Created with Past Forward',
            subheader: 'on Google AI Studio',
        },
    }
};

const promptsData = {
    ar: [
        { title: 'فني', prompt: 'حوّل الشخص في هذه الصورة إلى لوحة زيتية كلاسيكية، مع التركيز على القوام الغني والظلال العميقة والإضاءة الدرامية بأسلوب فنان أوروبي قديم.' },
        { title: 'بطل خارق', prompt: 'أعد تصور الشخص كبطل خارق، وامنحه زيًا فريدًا ومفصلاً يعكس قواه. يجب أن تكون الخلفية مشهد مدينة ديناميكي عند الغسق.' },
        { title: 'خيال علمي', prompt: 'ضع الشخص في مدينة سيبرانية مستقبلية. يجب أن تكون الصورة مليئة بأضواء النيون والهياكل المعمارية المستقبلية والتكنولوجيا المتقدمة.' },
        { title: 'فن البكسل', prompt: 'حوّل الصورة إلى عمل فني بكسل مفصل بأسلوب 16 بت، مشابه لألعاب الفيديو الكلاسيكية من حقبة التسعينيات.' },
        { title: 'أنمي', prompt: 'أعد رسم الشخص كشخصية رئيسية في فيلم أنمي، بأسلوب فني مستوحى من استوديو جيبلي، مع خلفية طبيعية خلابة.' },
        { title: 'ستيم بانك', prompt: 'أعد تصور الشخص بجمالية ستيم بانك متقنة. قم بتضمين ملابس من العصر الفيكتوري مع تروس نحاسية ونظارات واقية وأدوات ميكانيكية معقدة.' }
    ],
    en: [
        { title: 'Artistic', prompt: 'Transform the person in this photo into a classical oil painting, capturing the rich textures, deep shadows, and dramatic lighting of a European master\'s style.' },
        { title: 'Superhero', prompt: 'Reimagine the person as a superhero, giving them a unique and detailed costume that reflects their powers. The background should be a dynamic city scene at dusk.' },
        { title: 'Sci-Fi', prompt: 'Place the person into a futuristic, cyberpunk cityscape. The image should be filled with neon lights, futuristic architecture, and advanced technology.' },
        { title: 'Pixel Art', prompt: 'Convert the photo into a detailed 16-bit pixel art piece, reminiscent of classic video games from the SNES era.' },
        { title: 'Anime', prompt: 'Redraw the person as a main character in an anime film, with an art style inspired by Studio Ghibli, set against a beautiful natural backdrop.' },
        { title: 'Steampunk', prompt: 'Reimagine the person with an elaborate steampunk aesthetic. Include Victorian-era clothing mixed with brass gears, goggles, and intricate mechanical gadgets.' }
    ]
};

export const translations = translationData;
export const getPrompts = (lang: Language) => promptsData[lang];
