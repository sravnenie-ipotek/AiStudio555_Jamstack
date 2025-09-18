const { chromium } = require('playwright');
const fs = require('fs');

async function runUltraDetailedTranslationScan() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🚀 Starting Ultra-Comprehensive Translation Scan...');

    try {
        // Load the page directly (it should already have Russian language support)
        await page.goto('http://localhost:3005/home.html', { waitUntil: 'networkidle' });
        console.log('✅ Page loaded successfully');

        // Switch to Russian language via language manager
        await page.evaluate(() => {
            if (window.languageManager) {
                window.languageManager.switchLanguage('ru');
                console.log('✅ Switched to Russian via languageManager');
            } else {
                console.log('⚠️ languageManager not available, analyzing current page');
            }
        });

        // Wait for dynamic content to load
        await page.waitForTimeout(3000);

        // Get all text-containing elements with comprehensive analysis
        const analysisResults = await page.evaluate(() => {
            const results = {
                untranslatedElements: [],
                translatedElements: [],
                summary: {
                    totalElements: 0,
                    untranslatedCount: 0,
                    translatedCount: 0,
                    categories: {}
                },
                sections: {}
            };

            // Russian text detection patterns
            const russianPatterns = [
                /[а-яё]/i,  // Cyrillic characters
                /\b(и|в|на|с|по|для|от|до|из|к|о|об|при|без|под|над|за|через|про|против|среди|между|внутри|вне|возле|около|рядом|вдоль|вокруг|сквозь|благодаря|согласно|вопреки|несмотря|ввиду|вследствие|касательно|относительно|насчет|что|как|где|когда|почему|зачем|который|какой|чей|сколько|да|нет|не|ни|или|либо|то|если|чтобы|хотя|пока|пусть|пускай|даже|именно|только|лишь|уже|еще|все|всё|это|этот|тот|такой|другой|сам|свой|наш|ваш|их|его|её|мой|твой|один|два|три|первый|второй|третий|новый|старый|большой|маленький|хороший|плохой|белый|черный|красный|синий|зеленый|желтый|можно|нужно|надо|должен|может|хочет|любит|знает|делает|говорит|идет|дает|берет|видит|слышит|думает|понимает|работает|учится|живет|спит|ест|пьет|играет|читает|пишет|покупает|продает|помогает|учит|изучает|создает|строит|развивает|улучшает|изменяет|решает|выбирает|получает|отправляет|приходит|уходит|остается|начинает|заканчивает|продолжает|останавливается|открывает|закрывает|включает|выключает|показывает|скрывает|находит|теряет|забывает|помнит|встречает|знакомится|общается|разговаривает|молчит|смеется|плачет|радуется|грустит|боится|удивляется|злится|любопытствует|интересуется|мечтает|планирует|организует|управляет|контролирует|проверяет|исследует|анализирует|сравнивает|оценивает|рекомендует|советует|предлагает|приглашает|благодарит|извиняется|поздравляет|желает|надеется|верит|доверяет|сомневается|уверен|готов|свободен|занят|усталый|здоровый|больной|счастливый|несчастный|довольный|недовольный|спокойный|нервный|уверенный|неуверенный|сильный|слабый|умный|глупый|богатый|бедный|молодой|старый|красивый|некрасивый|добрый|злой|честный|нечестный|вежливый|невежливый|терпеливый|нетерпеливый|внимательный|невнимательный|осторожный|неосторожный|быстрый|медленный|легкий|тяжелый|простой|сложный|интересный|скучный|полезный|бесполезный|важный|неважный|необходимый|ненужный|возможный|невозможный|правильный|неправильный|точный|неточный|ясный|неясный|понятный|непонятный|открытый|закрытый|публичный|частный|общий|личный|местный|иностранный|российский|международный|глобальный|региональный|национальный|государственный|правительственный|политический|экономический|социальный|культурный|исторический|современный|будущий|прошлый|настоящий|временный|постоянный|регулярный|нерегулярный|ежедневный|еженедельный|ежемесячный|ежегодный|разовый|многократный|первичный|вторичный|основной|дополнительный|главный|второстепенный|центральный|периферийный|внутренний|внешний|верхний|нижний|передний|задний|левый|правый|северный|южный|восточный|западный|городской|сельский|домашний|рабочий|школьный|университетский|профессиональный|любительский|официальный|неофициальный|формальный|неформальный|строгий|нестрогий|серьезный|несерьезный|реальный|нереальный|настоящий|ненастоящий|истинный|ложный|правдивый|обманчивый|честный|нечестный|справедливый|несправедливый|равный|неравный|одинаковый|разный|похожий|непохожий|знакомый|незнакомый|известный|неизвестный|популярный|непопулярный|знаменитый|безвестный|успешный|неуспешный|удачный|неудачный|везучий|невезучий|счастливый|несчастливый|радостный|грустный|веселый|печальный|смешной|серьезный|забавный|скучный|интересный|неинтересный|увлекательный|неувлекательный|захватывающий|незахватывающий|волнующий|неволнующий|тревожный|спокойный|мирный|немирный|безопасный|опасный|надежный|ненадежный|стабильный|нестабильный|устойчивый|неустойчивый|прочный|непрочный|крепкий|слабый|твердый|мягкий|жесткий|нежный|грубый|деликатный|тонкий|толстый|узкий|широкий|высокий|низкий|длинный|короткий|глубокий|мелкий|далекий|близкий|дальний|ближний|дорогой|дешевый|бесплатный|платный|дорогостоящий|недорогой|ценный|бесценный|полезный|вредный|безвредный|опасный|безопасный|чистый|грязный|свежий|несвежий|новый|старый|современный|устаревший|модный|немодный|стильный|нестильный|элегантный|неэлегантный|красивый|некрасивый|прекрасный|ужасный|великолепный|отвратительный|замечательный|ужасный|превосходный|плохой|отличный|ужасный|хороший|плохой|лучший|худший|самый|наиболее|наименее|очень|совсем|довольно|достаточно|слишком|чрезмерно|недостаточно|почти|едва|еле|только|лишь|исключительно|единственно|особенно|специально|нарочно|случайно|неожиданно|внезапно|постепенно|медленно|быстро|немедленно|сразу|тотчас|мгновенно|моментально|временно|навсегда|всегда|никогда|иногда|часто|редко|постоянно|регулярно|периодически|ежедневно|еженедельно|ежемесячно|ежегодно|сегодня|вчера|завтра|позавчера|послезавтра|сейчас|теперь|тогда|потом|раньше|позже|недавно|скоро|долго|кратко|быстро|медленно|рано|поздно|вовремя|своевременно|досрочно|с|опозданием|здесь|там|тут|везде|нигде|где-то|где-нибудь|куда-то|куда-нибудь|откуда-то|откуда-нибудь|дома|на|работе|в|школе|в|университете|на|улице|в|магазине|в|ресторане|в|кафе|в|театре|в|кино|в|музее|в|парке|на|природе|на|даче|в|отпуске|в|командировке|в|поездке|в|путешествии|дорого|дешево|бесплатно|платно|выгодно|невыгодно|экономично|неэкономично|прибыльно|убыточно|эффективно|неэффективно|продуктивно|непродуктивно|результативно|безрезультатно|успешно|неуспешно|удачно|неудачно|правильно|неправильно|верно|неверно|точно|неточно|ясно|неясно|понятно|непонятно|четко|нечетко|ярко|тускло|громко|тихо|быстро|медленно|аккуратно|неаккуратно|внимательно|невнимательно|осторожно|неосторожно|бережно|небережно|заботливо|незаботливо|ответственно|безответственно|серьезно|несерьезно|искренне|неискренне|честно|нечестно|открыто|закрыто|прямо|непрямо|ясно|туманно|определенно|неопределенно|конкретно|абстрактно|практически|теоретически|реально|нереально|фактически|номинально|действительно|мнимо|объективно|субъективно|логично|нелогично|разумно|неразумно|мудро|немудро|умно|глупо|грамотно|неграмотно|профессионально|непрофессионально|качественно|некачественно|надежно|ненадежно|стабильно|нестабильно|постоянно|непостоянно|регулярно|нерегулярно|систематически|несистематически|организованно|неорганизованно|планомерно|беспланово|целенаправленно|бесцельно|осмысленно|бессмысленно|полезно|бесполезно|необходимо|ненужно|важно|неважно|существенно|несущественно|значительно|незначительно|заметно|незаметно|видимо|невидимо|очевидно|неочевидно|ясно|неясно|понятно|непонятно|доступно|недоступно|возможно|невозможно|вероятно|невероятно|реально|нереально|осуществимо|неосуществимо|выполнимо|невыполнимо|достижимо|недостижимо|приемлемо|неприемлемо|допустимо|недопустимо|позволительно|непозволительно|разрешено|запрещено|можно|нельзя|нужно|не|нужно|надо|не|надо|должно|не|должно|следует|не|следует|стоит|не|стоит|рекомендуется|не|рекомендуется|желательно|нежелательно|предпочтительно|непредпочтительно|лучше|хуже|больше|меньше|выше|ниже|дальше|ближе|раньше|позже|быстрее|медленнее|чаще|реже|громче|тише|ярче|темнее|светлее|темнее|теплее|холоднее|горячее|прохладнее|жарче|морознее|суше|влажнее|чище|грязнее|свежее|несвежее|новее|старее|моложе|старше|выше|ниже|больше|меньше|шире|уже|длиннее|короче|глубже|мельче|дальше|ближе|дороже|дешевле|лучше|хуже|проще|сложнее|легче|тяжелее|быстрее|медленнее|громче|тише|ярче|тусклее|точнее|неточнее|яснее|туманнее|определеннее|неопределеннее|конкретнее|абстрактнее|практичнее|теоретичнее|реальнее|нереальнее|правдивее|лживее|честнее|нечестнее|справедливее|несправедливее|добрее|злее|мудрее|глупее|умнее|глупее|образованнее|необразованнее|культурнее|некультурнее|воспитаннее|невоспитаннее|вежливее|невежливее|деликатнее|грубее|внимательнее|невнимательнее|заботливее|равнодушнее|ответственнее|безответственнее|надежнее|ненадежнее|преданнее|предательнее|верннее|неверннее|постояннее|непостояннее|стабильнее|нестабильнее|организованнее|неорганизованнее|дисциплинированнее|недисциплинированнее|пунктуальнее|непунктуальнее|аккуратнее|неаккуратнее|чище|грязнее|опрятнее|неопрятнее|здоровее|больнее|сильнее|слабее|выносливее|менее|выносливый|энергичнее|вялее|активнее|пассивнее|живее|мертвее|веселее|грустнее|радостнее|печальнее|счастливее|несчастнее|довольнее|недовольнее|спокойнее|нервнее|уверенее|неуверенее|смелее|трусливее|храбрее|боязливее|решительнее|нерешительнее|настойчивее|ненастойчивее|упорнее|менее|упорный|терпеливее|нетерпеливее|выдержаннее|невыдержаннее|сдержаннее|несдержаннее|самообладанее|без|самообладания|спокойнее|взволнованнее|расслабленнее|напряженнее|свободнее|скованнее|раскованнее|зажатее|открытее|закрытее|общительнее|замкнутее|дружелюбнее|враждебнее|приветливее|неприветливее|гостеприимнее|негостеприимнее|радушнее|нерадушнее|теплее|холоднее|сердечнее|бессердечнее|душевнее|бездушнее|человечнее|бесчеловечнее|гуманнее|негуманнее|милосерднее|немилосерднее|сострадательнее|бессострадательнее|жалостливее|безжалостнее|понимающее|непонимающее|снисходительнее|неснисходительнее|терпимее|нетерпимее|толерантнее|нетолерантнее|либеральнее|консервативнее|прогрессивнее|реакционнее|современнее|архаичнее|новаторское|традиционнее|оригинальнее|банальнее|творческее|нетворческее|изобретательнее|неизобретательнее|находчивее|ненаходчивее|сообразительнее|несообразительнее|догадливее|недогадливее|проницательнее|непроницательнее|наблюдательнее|ненаблюдательнее|внимательнее|невнимательнее|сосредоточеннее|рассеяннее|сконцентрированнее|несконцентрированнее|собраннее|несобраннее|организованнее|неорганизованнее|систематичнее|несистематичнее|методичнее|неметодичнее|последовательнее|непоследовательнее|логичнее|нелогичнее|рациональнее|иррациональнее|разумнее|неразумнее|обдуманнее|необдуманнее|взвешеннее|невзвешеннее|осторожнее|неосторожнее|предусмотрительнее|непредусмотрительнее|дальновиднее|близоруким|практичнее|непractичнее|реалистичнее|нереалистичнее|прагматичнее|непрагматичнее|деловее|неделовее|профессиональнее|непрофессиональнее|компетентнее|некомпетентнее|квалифицированнее|неквалифицированнее|опытнее|неопытнее|знающее|незнающее|образованнее|необразованнее|эрудированнее|неэрудированнее|начитаннее|неначитаннее|грамотнее|неграмотнее|культурнее|некультурнее|цивилизованнее|нецивилизованнее|развитее|неразвитее|продвинутее|отсталее|передовее|консервативнее|инновационнее|традиционнее|революционнее|эволюционнее|радикальнее|умереннее|экстремальнее|крайнее|сбалансированнее|несбалансированнее|гармоничнее|негармоничнее|пропорциональнее|непропорциональнее|симметричнее|асимметричнее|ровнее|неровнее|гладкое|шероховатее|ровнее|бугристее|плоское|выпуклее|прямее|кривее|ровнее|изогнутее|вертикальнее|горизонтальнее|наклоннее|прямее|круглее|квадратнее|треугольнее|овальнее|сферичнее|кубичнее|цилиндричнее|конусообразнее|пирамидальнее|призматичнее|спиральнее|волнообразнее|зигзагообразнее|змееобразнее|дугообразнее|кольцеобразнее|петлеобразнее|ветвеобразнее|звездообразнее|крестообразнее|сердцеобразнее|каплеобразнее|грушеобразнее|яйцеобразнее|шарообразнее|кубообразнее|призмообразнее|конусообразнее|пирамидообразнее|цилиндрообразнее|трубкообразнее|воронкообразнее|чашеобразнее|блюдцеобразнее|тарелкообразнее|ложкообразнее|ножеобразнее|мечеобразнее|копьеобразнее|стрелообразнее|лукообразнее|дугообразнее|серпообразнее|полумесяцеобразнее|месяцеобразнее|солнцеобразнее|звездообразнее|крестообразнее|плюсообразнее|минусообразнее|знакообразнее|буквообразнее|цифрообразнее|символообразнее|фигурообразнее|формообразнее|контурообразнее|силуэтообразнее|тенеобразнее|призракообразнее|фантомообразнее|миражеобразнее|иллюзиеобразнее|образообразнее|картинообразнее|изображениеобразнее|рисунокообразнее|скульптурообразнее|статуеобразнее|фигуркообразнее|игрушкообразнее|куклообразнее|роботообразнее|машинообразнее|механизмообразнее|устройствообразнее|приборообразнее|инструментообразнее|орудиеобразнее|оружиеобразнее|мечеобразнее|кинжалообразнее|ножеобразнее|топорообразнее|молоткообразнее|гвоздеобразнее|шурупообразнее|болтообразнее|гайкообразнее|ключеобразнее|замкообразнее|петлеобразнее|кольцеобразнее|цепеобразнее|веревкообразнее|нитеобразнее|проволокообразнее|тросообразнее|кабелеобразнее|шнурообразнее|лентообразнее|полосообразнее|линеобразнее|штрихообразнее|черточкообразнее|точкообразнее|пунктирообразнее|прерывистообразнее|сплошнообразнее|непрерывнообразнее|постояннообразнее|временнообразнее|периодичнообразнее|циклическиобразнее|ритмичнообразнее|равномернообразнее|неравномернообразнее|регулярнообразнее|нерегулярнообразнее|систематическиобразнее|несистематическиобразнее|планомернообразнее|\b)/g
            ];

            const isRussian = (text) => {
                if (!text || typeof text !== 'string') return false;
                const cleanText = text.trim().toLowerCase();
                if (cleanText.length === 0) return false;

                // Check for Cyrillic characters (primary indicator)
                const hasCyrillic = /[а-яё]/i.test(cleanText);
                if (hasCyrillic) return true;

                // Check for common Russian words
                const hasRussianWords = russianPatterns.some(pattern => pattern.test(cleanText));
                return hasRussianWords;
            };

            const isEnglish = (text) => {
                if (!text || typeof text !== 'string') return false;
                const cleanText = text.trim().toLowerCase();
                if (cleanText.length === 0) return false;

                // Check for Latin alphabet
                const hasLatin = /[a-z]/i.test(cleanText);
                if (!hasLatin) return false;

                // Exclude if contains Cyrillic
                const hasCyrillic = /[а-яё]/i.test(cleanText);
                if (hasCyrillic) return false;

                // Common English patterns that indicate untranslated content
                const englishPatterns = [
                    /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|about|into|through|during|before|after|above|below|between|among|since|until|while|because|although|however|therefore|moreover|furthermore|nevertheless|meanwhile|otherwise|instead|besides|except|without|within|beyond|beneath|behind|beside|across|around|against|towards|throughout|underneath|alongside|despite|regarding|concerning|including|excluding|according|depending|considering|assuming|provided|unless|whether|either|neither|both|all|any|some|many|much|few|little|more|most|less|least|every|each|another|other|same|different|new|old|young|first|last|next|previous|current|former|latter|following|above|below|here|there|where|when|why|how|what|who|whom|whose|which|that|this|these|those|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|billion|good|bad|great|small|big|large|huge|tiny|high|low|long|short|wide|narrow|thick|thin|deep|shallow|fast|slow|quick|rapid|early|late|soon|now|then|today|tomorrow|yesterday|always|never|sometimes|often|rarely|usually|normally|typically|generally|specifically|particularly|especially|mainly|mostly|partly|completely|totally|fully|entirely|absolutely|exactly|precisely|approximately|roughly|nearly|almost|quite|very|extremely|incredibly|amazingly|surprisingly|obviously|clearly|definitely|certainly|probably|possibly|maybe|perhaps|hopefully|unfortunately|luckily|surprisingly|interestingly|importantly|significantly|remarkably|notably|particularly|especially|mainly|primarily|basically|essentially|fundamentally|ultimately|eventually|finally|initially|originally|previously|recently|currently|presently|immediately|suddenly|gradually|slowly|quickly|rapidly|easily|simply|clearly|obviously|apparently|evidently|supposedly|allegedly|reportedly|presumably|seemingly|apparently|definitely|certainly|absolutely|positively|undoubtedly|surely|obviously|clearly|evidently|plainly|manifestly|patently|transparently|unmistakably|unquestionably|indubitably|incontrovertibly|irrefutably|undeniably|categorically|emphatically|decidedly|resolutely|firmly|strongly|deeply|profoundly|intensely|extremely|tremendously|enormously|vastly|immensely|considerably|substantially|significantly|markedly|notably|remarkably|exceptionally|extraordinarily|unusually|particularly|especially|specifically|precisely|exactly|accurately|correctly|properly|appropriately|suitably|fittingly|perfectly|ideally|optimally|maximally|minimally|barely|hardly|scarcely|rarely|seldom|occasionally|sometimes|frequently|regularly|constantly|continually|continuously|perpetually|eternally|forever|permanently|temporarily|briefly|momentarily|instantly|immediately|directly|straightaway|promptly|quickly|rapidly|swiftly|speedily|hastily|hurriedly|urgently|desperately|eagerly|enthusiastically|passionately|intensely|deeply|profoundly|thoroughly|completely|totally|entirely|fully|wholly|absolutely|perfectly|exactly|precisely|accurately|correctly|properly|appropriately|suitably|adequately|sufficiently|satisfactorily|acceptably|tolerably|reasonably|fairly|quite|rather|somewhat|slightly|barely|hardly|scarcely|minimally|marginally|negligibly|insignificantly|trivially|superficially|partially|incompletely|inadequately|insufficiently|unsatisfactorily|unacceptably|intolerably|unreasonably|unfairly|unjustly|improperly|incorrectly|inaccurately|imprecisely|inexactly|approximately|roughly|broadly|generally|typically|normally|usually|commonly|frequently|regularly|systematically|methodically|carefully|cautiously|prudently|wisely|intelligently|cleverly|skillfully|expertly|professionally|competently|efficiently|effectively|successfully|productively|profitably|beneficially|advantageously|favorably|positively|constructively|creatively|innovatively|originally|uniquely|distinctively|characteristically|typically|normally|naturally|obviously|clearly|evidently|apparently|seemingly|supposedly|allegedly|reportedly|presumably|conceivably|possibly|potentially|theoretically|hypothetically|practically|realistically|logically|reasonably|sensibly|rationally|objectively|subjectively|personally|individually|collectively|jointly|together|separately|independently|autonomously|automatically|manually|mechanically|electronically|digitally|technologically|scientifically|mathematically|statistically|economically|financially|commercially|industrially|agriculturally|medically|legally|politically|socially|culturally|historically|geographically|environmentally|psychologically|philosophically|religiously|spiritually|morally|ethically|aesthetically|artistically|musically|literally|figuratively|metaphorically|symbolically|theoretically|practically|actually|really|truly|genuinely|authentically|legitimately|validly|soundly|solidly|firmly|strongly|powerfully|forcefully|vigorously|energetically|actively|passively|aggressively|defensively|offensively|strategically|tactically|systematically|methodically|carefully|carelessly|recklessly|dangerously|safely|securely|confidently|nervously|anxiously|worriedly|fearfully|courageously|bravely|boldly|timidly|shyly|modestly|humbly|proudly|arrogantly|confidently|uncertainly|doubtfully|skeptically|optimistically|pessimistically|realistically|idealistically|romantically|pragmatically|logically|emotionally|rationally|irrationally|sensibly|foolishly|wisely|stupidly|intelligently|ignorantly|knowledgeably|expertly|professionally|amateurishly|skillfully|clumsily|gracefully|awkwardly|elegantly|crudely|refined|roughly|smoothly|harshly|gently|softly|loudly|quietly|silently|noisily|peacefully|violently|calmly|wildly|orderly|chaotically|organized|disorganized|structured|unstructured|planned|unplanned|prepared|unprepared|ready|unready|willing|unwilling|eager|reluctant|enthusiastic|apathetic|interested|disinterested|curious|indifferent|attentive|inattentive|focused|unfocused|concentrated|distracted|alert|drowsy|awake|asleep|conscious|unconscious|aware|unaware|mindful|mindless|thoughtful|thoughtless|considerate|inconsiderate|caring|uncaring|loving|unloving|kind|unkind|cruel|merciful|generous|stingy|selfish|selfless|greedy|content|satisfied|dissatisfied|happy|unhappy|joyful|sorrowful|cheerful|gloomy|bright|dark|light|heavy|easy|difficult|simple|complex|plain|fancy|basic|advanced|elementary|sophisticated|primitive|modern|ancient|contemporary|traditional|conventional|unconventional|normal|abnormal|typical|atypical|standard|nonstandard|regular|irregular|ordinary|extraordinary|common|uncommon|rare|frequent|usual|unusual|familiar|unfamiliar|known|unknown|recognized|unrecognized|identified|unidentified|named|unnamed|titled|untitled|labeled|unlabeled|marked|unmarked|signed|unsigned|dated|undated|numbered|unnumbered|counted|uncounted|measured|unmeasured|weighed|unweighed|tested|untested|examined|unexamined|checked|unchecked|verified|unverified|confirmed|unconfirmed|proven|unproven|established|unestablished|founded|unfounded|based|unbased|grounded|ungrounded|supported|unsupported|backed|unbacked|endorsed|unendorsed|approved|unapproved|accepted|unaccepted|rejected|unrejected|denied|undenied|refused|unrefused|declined|undeclined|dismissed|undismissed|ignored|unignored|neglected|unneglected|overlooked|noticed|observed|unobserved|seen|unseen|viewed|unviewed|watched|unwatched|looked|unlooked|stared|unstared|gazed|ungazed|glanced|unglanced|peeked|unpeeked|spied|unspied|spotted|unspotted|detected|undetected|discovered|undiscovered|found|unfound|located|unlocated|positioned|unpositioned|placed|unplaced|set|unset|put|unput|laid|unlaid|dropped|undropped|thrown|unthrown|tossed|untossed|cast|uncast|hurled|unhurled|flung|unflung|pitched|unpitched|launched|unlaunched|fired|unfired|shot|unshot|aimed|unaimed|targeted|untargeted|directed|undirected|pointed|unpointed|indicated|unindicated|shown|unshown|displayed|undisplayed|exhibited|unexphibited|presented|unpresented|revealed|unrevealed|exposed|unexposed|uncovered|covered|opened|unopened|closed|unclosed|locked|unlocked|sealed|unsealed|wrapped|unwrapped|packed|unpacked|filled|unfilled|empty|full|loaded|unloaded|charged|uncharged|powered|unpowered|energized|unenergized|activated|deactivated|enabled|disabled|turned|unturned|switched|unswitched|pressed|unpressed|pushed|unpushed|pulled|unpulled|lifted|unlifted|raised|unraised|lowered|unlowered|moved|unmoved|shifted|unshifted|transferred|untransferred|transported|untransported|carried|uncarried|brought|unbrought|taken|untaken|given|ungiven|handed|unhanded|passed|unpassed|delivered|undelivered|sent|unsent|received|unreceived|accepted|unaccepted|collected|uncollected|gathered|ungathered|assembled|unassembled|built|unbuilt|constructed|unconstructed|created|uncreated|made|unmade|produced|unproduced|manufactured|unmanufactured|generated|ungenerated|formed|unformed|shaped|unshaped|molded|unmolded|designed|undesigned|planned|unplanned|developed|undeveloped|invented|uninvented|discovered|undiscovered|researched|unresearched|studied|unstudied|learned|unlearned|taught|untaught|educated|uneducated|trained|untrained|practiced|unpracticed|experienced|inexperienced|skilled|unskilled|qualified|unqualified|certified|uncertified|licensed|unlicensed|authorized|unauthorized|permitted|unpermitted|allowed|unallowed|approved|unapproved|banned|unbanned|prohibited|unprohibited|forbidden|unforbidden|restricted|unrestricted|limited|unlimited|controlled|uncontrolled|regulated|unregulated|managed|unmanaged|supervised|unsupervised|monitored|unmonitored|watched|unwatched|guarded|unguarded|protected|unprotected|defended|undefended|secured|unsecured|safe|unsafe|dangerous|harmless|harmful|beneficial|detrimental|advantageous|disadvantageous|positive|negative|good|evil|right|wrong|correct|incorrect|true|false|real|fake|genuine|artificial|natural|synthetic|organic|inorganic|living|dead|alive|lifeless|animate|inanimate|conscious|unconscious|intelligent|unintelligent|smart|dumb|clever|stupid|wise|foolish|brilliant|dim|sharp|dull|quick|slow|fast|sluggish|rapid|gradual|sudden|immediate|instant|delayed|prompt|late|early|timely|untimely|seasonal|year-round|daily|weekly|monthly|yearly|annual|regular|irregular|constant|variable|stable|unstable|steady|unsteady|firm|shaky|solid|liquid|gas|plasma|hard|soft|tough|tender|strong|weak|powerful|powerless|mighty|feeble|robust|frail|sturdy|delicate|durable|fragile|lasting|temporary|permanent|transient|eternal|mortal|immortal|finite|infinite|limited|limitless|bounded|unbounded|restricted|unrestricted|narrow|broad|wide|thin|thick|fat|skinny|slim|plump|lean|muscular|flabby|fit|unfit|healthy|sick|well|ill|fine|poor|excellent|terrible|perfect|imperfect|flawless|flawed|complete|incomplete|whole|partial|total|fractional|full|empty|solid|hollow|dense|sparse|thick|thin|heavy|light|massive|tiny|huge|minute|giant|miniature|enormous|microscopic|vast|minuscule|immense|petite|colossal|compact|spacious|cramped|roomy|tight|loose|slack|taut|relaxed|tense|calm|agitated|peaceful|turbulent|quiet|noisy|silent|loud|soft|harsh|gentle|rough|smooth|even|uneven|level|slanted|straight|crooked|flat|curved|round|square|circular|angular|spherical|cubic|triangular|rectangular|oval|elliptical|conical|cylindrical|pyramidal|prismatic|spiral|helical|twisted|bent|folded|stretched|compressed|expanded|contracted|inflated|deflated|swollen|shrunken|enlarged|reduced|increased|decreased|multiplied|divided|added|subtracted|calculated|computed|measured|estimated|counted|numbered|quantified|qualified|described|explained|defined|undefined|specified|unspecified|detailed|general|particular|universal|specific|generic|individual|collective|personal|impersonal|private|public|confidential|open|secret|hidden|visible|invisible|apparent|obscure|clear|unclear|obvious|subtle|plain|complex|simple|complicated|easy|difficult|hard|effortless|challenging|demanding|requiring|needing|wanting|desiring|wishing|hoping|expecting|anticipating|predicting|forecasting|planning|organizing|arranging|preparing|setting|establishing|founding|creating|building|constructing|developing|growing|expanding|extending|stretching|reaching|touching|feeling|sensing|perceiving|noticing|observing|watching|looking|seeing|viewing|examining|inspecting|checking|testing|trying|attempting|striving|struggling|fighting|battling|competing|contesting|challenging|opposing|resisting|defending|attacking|assaulting|invading|conquering|defeating|winning|losing|succeeding|failing|achieving|accomplishing|completing|finishing|ending|concluding|stopping|ceasing|continuing|proceeding|advancing|progressing|moving|traveling|journeying|going|coming|arriving|departing|leaving|staying|remaining|waiting|pausing|resting|relaxing|sleeping|waking|rising|standing|sitting|lying|walking|running|jogging|sprinting|crawling|climbing|jumping|leaping|flying|swimming|diving|floating|sinking|falling|dropping|rising|lifting|carrying|holding|grasping|gripping|releasing|letting|dropping|throwing|catching|hitting|striking|beating|pounding|knocking|tapping|touching|rubbing|scratching|tickling|pinching|squeezing|pressing|pushing|pulling|dragging|lifting|lowering|raising|opening|closing|turning|rotating|spinning|twisting|bending|folding|unfolding|wrapping|unwrapping|covering|uncovering|hiding|revealing|showing|displaying|exhibiting|demonstrating|presenting|introducing|announcing|declaring|stating|saying|telling|speaking|talking|whispering|shouting|screaming|yelling|calling|naming|mentioning|referring|pointing|indicating|signaling|gesturing|nodding|shaking|waving|smiling|laughing|giggling|chuckling|grinning|frowning|crying|weeping|sobbing|sniffling|sighing|breathing|inhaling|exhaling|snoring|coughing|sneezing|yawning|stretching|exercising|working|laboring|toiling|striving|struggling|trying|attempting|practicing|training|studying|learning|teaching|instructing|educating|informing|telling|explaining|describing|defining|clarifying|illustrating|demonstrating|showing|proving|confirming|verifying|validating|testing|checking|examining|inspecting|investigating|researching|exploring|discovering|finding|locating|searching|seeking|looking|hunting|fishing|catching|trapping|capturing|seizing|grabbing|taking|getting|obtaining|acquiring|gaining|earning|winning|receiving|accepting|collecting|gathering|assembling|building|constructing|creating|making|producing|manufacturing|generating|developing|growing|cultivating|raising|breeding|feeding|nourishing|nurturing|caring|tending|maintaining|keeping|preserving|protecting|defending|guarding|watching|monitoring|supervising|controlling|managing|directing|leading|guiding|instructing|commanding|ordering|requesting|asking|questioning|inquiring|wondering|thinking|considering|pondering|reflecting|meditating|contemplating|imagining|dreaming|fantasizing|visualizing|picturing|remembering|recalling|forgetting|ignoring|neglecting|overlooking|missing|lacking|needing|requiring|demanding|wanting|desiring|craving|longing|yearning|wishing|hoping|expecting|anticipating|awaiting|preparing|planning|organizing|arranging|scheduling|timing|coordinating|synchronizing|matching|comparing|contrasting|differentiating|distinguishing|separating|dividing|splitting|breaking|cracking|fracturing|shattering|destroying|demolishing|ruining|damaging|harming|hurting|injuring|wounding|healing|curing|treating|helping|assisting|supporting|aiding|serving|providing|supplying|offering|giving|donating|contributing|sharing|distributing|spreading|scattering|dispersing|gathering|collecting|accumulating|storing|saving|keeping|holding|containing|including|comprising|consisting|involving|concerning|regarding|relating|connecting|linking|joining|uniting|combining|merging|mixing|blending|fusing|melting|freezing|cooling|heating|warming|burning|cooking|baking|roasting|frying|boiling|steaming|grilling|smoking|seasoning|flavoring|tasting|eating|drinking|consuming|digesting|swallowing|chewing|biting|licking|sucking|sipping|gulping|satisfying|filling|emptying|loading|unloading|packing|unpacking|wrapping|unwrapping|dressing|undressing|wearing|removing|putting|taking|adding|subtracting|including|excluding|inserting|extracting|installing|uninstalling|connecting|disconnecting|plugging|unplugging|switching|turning|starting|stopping|beginning|ending|opening|closing|locking|unlocking|securing|releasing|fastening|unfastening|tying|untying|binding|unbinding|attaching|detaching|fixing|unfixing|repairing|breaking|mending|patching|replacing|substituting|changing|altering|modifying|adjusting|adapting|customizing|personalizing|standardizing|normalizing|regularizing|systematizing|organizing|arranging|ordering|sorting|classifying|categorizing|grouping|listing|numbering|labeling|marking|signing|dating|timing|scheduling|planning|designing|creating|inventing|developing|improving|enhancing|upgrading|updating|modernizing|renovating|restoring|refreshing|renewing|reviving|revitalizing|energizing|motivating|inspiring|encouraging|supporting|helping|assisting|guiding|directing|leading|managing|controlling|supervising|monitoring|checking|verifying|confirming|validating|testing|examining|inspecting|investigating|analyzing|evaluating|assessing|judging|criticizing|praising|complimenting|thanking|appreciating|acknowledging|recognizing|admitting|confessing|revealing|disclosing|exposing|hiding|concealing|covering|protecting|defending|attacking|fighting|struggling|competing|racing|running|chasing|following|pursuing|hunting|searching|seeking|looking|finding|discovering|exploring|investigating|researching|studying|learning|understanding|comprehending|grasping|realizing|recognizing|knowing|remembering|forgetting|ignoring|neglecting|overlooking|noticing|observing|seeing|watching|looking|viewing|examining|inspecting|checking|testing|trying|attempting|practicing|performing|doing|acting|behaving|conducting|executing|implementing|applying|using|utilizing|employing|operating|functioning|working|running|moving|traveling|going|coming|arriving|departing|leaving|staying|remaining|continuing|proceeding|advancing|progressing|developing|growing|expanding|increasing|rising|climbing|ascending|descending|falling|dropping|declining|decreasing|reducing|shrinking|contracting|compressing|expanding|extending|stretching|reaching|touching|contacting|meeting|encountering|facing|confronting|approaching|avoiding|escaping|fleeing|running|hiding|seeking|finding|losing|winning|gaining|earning|achieving|accomplishing|succeeding|failing|trying|attempting|struggling|striving|working|laboring|toiling|resting|relaxing|sleeping|waking|living|existing|being|becoming|changing|transforming|converting|turning|shifting|moving|staying|remaining|keeping|maintaining|preserving|protecting|saving|losing|wasting|spending|investing|buying|selling|trading|exchanging|giving|receiving|taking|getting|obtaining|acquiring|possessing|owning|having|holding|keeping|storing|containing|including|comprising|involving|requiring|needing|demanding|wanting|desiring|liking|loving|enjoying|preferring|choosing|selecting|picking|deciding|determining|concluding|inferring|deducing|reasoning|thinking|considering|believing|supposing|assuming|expecting|hoping|wishing|dreaming|imagining|visualizing|planning|intending|meaning|signifying|representing|symbolizing|indicating|showing|demonstrating|proving|confirming|supporting|backing|endorsing|approving|accepting|agreeing|disagreeing|objecting|opposing|resisting|rejecting|refusing|declining|denying|admitting|confessing|acknowledging|recognizing|realizing|understanding|comprehending|grasping|learning|discovering|finding|knowing|remembering|recalling|forgetting|ignoring|overlooking|neglecting|missing|lacking|having|possessing|owning|containing|holding|keeping|storing|saving|preserving|maintaining|protecting|defending|guarding|watching|monitoring|supervising|controlling|managing|directing|leading|guiding|teaching|instructing|training|educating|informing|telling|explaining|describing|showing|demonstrating|illustrating|exemplifying|representing|symbolizing|meaning|signifying|indicating|suggesting|implying|hinting|alluding|referring|mentioning|noting|observing|remarking|commenting|stating|declaring|announcing|proclaiming|expressing|conveying|communicating|transmitting|sending|delivering|providing|supplying|offering|giving|presenting|submitting|contributing|donating|sharing|distributing|spreading|circulating|publishing|broadcasting|advertising|promoting|marketing|selling|buying|purchasing|acquiring|obtaining|getting|receiving|collecting|gathering|accumulating|storing|keeping|holding|maintaining|preserving|protecting|saving|investing|spending|wasting|losing|finding|discovering|locating|positioning|placing|setting|putting|laying|dropping|throwing|casting|hurling|launching|firing|shooting|aiming|targeting|hitting|striking|touching|reaching|extending|stretching|expanding|growing|developing|building|constructing|creating|making|producing|generating|forming|shaping|designing|planning|organizing|arranging|preparing|cooking|baking|cleaning|washing|drying|ironing|folding|storing|organizing|decorating|furnishing|equipping|supplying|providing|serving|helping|assisting|supporting|encouraging|motivating|inspiring|influencing|persuading|convincing|arguing|debating|discussing|talking|speaking|communicating|conversing|chatting|gossiping|whispering|murmuring|shouting|yelling|screaming|crying|laughing|smiling|grinning|frowning|pouting|sulking|brooding|worrying|fretting|panicking|relaxing|calming|soothing|comforting|consoling|encouraging|supporting|helping|assisting|serving|caring|loving|liking|enjoying|appreciating|admiring|respecting|honoring|worshipping|praying|meditating|contemplating|reflecting|thinking|pondering|wondering|questioning|doubting|believing|trusting|hoping|wishing|dreaming|fantasizing|imagining|creating|inventing|discovering|exploring|investigating|researching|studying|learning|practicing|training|exercising|working|playing|gaming|competing|winning|losing|succeeding|failing|achieving|accomplishing|completing|finishing|starting|beginning|continuing|stopping|pausing|resting|sleeping|waking|eating|drinking|breathing|living|dying|being|existing|happening|occurring|taking|place|going|coming|moving|staying|changing|remaining|keeping|becoming|turning|growing|developing|improving|worsening|increasing|decreasing|rising|falling|climbing|descending|advancing|retreating|approaching|departing|arriving|leaving|entering|exiting|opening|closing|starting|stopping|beginning|ending|continuing|interrupting|pausing|resuming|accelerating|decelerating|speeding|slowing|hurrying|rushing|dawdling|lingering|waiting|delaying|postponing|advancing|progressing|regressing|improving|deteriorating|enhancing|degrading|strengthening|weakening|tightening|loosening|hardening|softening|warming|cooling|heating|freezing|melting|solidifying|evaporating|condensing|expanding|contracting|growing|shrinking|increasing|decreasing|multiplying|dividing|adding|subtracting|calculating|computing|measuring|weighing|counting|estimating|approximating|rounding|truncating|extending|shortening|lengthening|widening|narrowing|deepening|shallowing|raising|lowering|lifting|dropping|pushing|pulling|pressing|releasing|squeezing|stretching|compressing|expanding|bending|straightening|twisting|turning|rotating|spinning|revolving|circling|spiraling|curving|angling|tilting|leaning|balancing|stabilizing|destabilizing|securing|releasing|fastening|loosening|tightening|adjusting|aligning|positioning|relocating|moving|shifting|transferring|transporting|carrying|delivering|sending|receiving|accepting|rejecting|approving|disapproving|allowing|forbidding|permitting|prohibiting|enabling|disabling|activating|deactivating|turning|switching|operating|functioning|working|running|stopping|starting|pausing|continuing|resuming|interrupting|breaking|mending|fixing|repairing|replacing|substituting|changing|altering|modifying|adjusting|adapting|customizing|standardizing|normalizing|optimizing|maximizing|minimizing|balancing|comparing|contrasting|matching|differing|resembling|imitating|copying|duplicating|replicating|reproducing|creating|generating|producing|manufacturing|building|constructing|assembling|disassembling|installing|uninstalling|setting|configuring|programming|coding|debugging|testing|validating|verifying|checking|examining|inspecting|analyzing|evaluating|assessing|reviewing|auditing|monitoring|tracking|following|pursuing|chasing|hunting|searching|seeking|looking|finding|discovering|locating|identifying|recognizing|distinguishing|differentiating|categorizing|classifying|grouping|organizing|sorting|arranging|ordering|ranking|rating|scoring|grading|marking|labeling|tagging|naming|titling|heading|captioning|describing|explaining|defining|interpreting|translating|converting|transforming|adapting|adjusting|modifying|editing|revising|updating|upgrading|improving|enhancing|optimizing|refining|polishing|perfecting|completing|finishing|concluding|ending|terminating|stopping|ceasing|discontinuing|abandoning|quitting|leaving|departing|exiting|escaping|fleeing|avoiding|preventing|protecting|defending|attacking|fighting|battling|struggling|competing|racing|running|walking|jogging|sprinting|crawling|climbing|jumping|leaping|diving|swimming|floating|sinking|flying|soaring|gliding|falling|dropping|rising|ascending|descending|landing|crashing|colliding|hitting|striking|touching|feeling|sensing|perceiving|experiencing|undergoing|suffering|enduring|tolerating|bearing|withstanding|resisting|opposing|fighting|struggling|striving|trying|attempting|endeavoring|working|laboring|toiling|serving|helping|assisting|supporting|aiding|contributing|participating|engaging|involving|including|comprising|containing|holding|carrying|bearing|supporting|sustaining|maintaining|keeping|preserving|conserving|protecting|saving|storing|accumulating|collecting|gathering|assembling|building|constructing|creating|forming|shaping|molding|designing|planning|preparing|organizing|arranging|coordinating|managing|directing|leading|guiding|supervising|overseeing|monitoring|watching|observing|noticing|seeing|viewing|looking|examining|inspecting|checking|testing|trying|tasting|smelling|hearing|listening|feeling|touching|experiencing|living|existing|being|staying|remaining|continuing|lasting|enduring|persisting|surviving|thriving|flourishing|prospering|succeeding|achieving|accomplishing|attaining|reaching|obtaining|gaining|earning|winning|losing|failing|struggling|suffering|enjoying|loving|liking|preferring|choosing|selecting|deciding|determining|concluding|finishing|ending|starting|beginning|initiating|launching|establishing|founding|creating|building|developing|growing|expanding|extending|increasing|improving|enhancing|upgrading|advancing|progressing|moving|changing|transforming|evolving|adapting|adjusting|modifying|altering|updating|revising|editing|correcting|fixing|repairing|mending|healing|curing|treating|helping|supporting|assisting|serving|providing|supplying|delivering|giving|offering|presenting|showing|demonstrating|teaching|instructing|educating|training|learning|studying|researching|investigating|exploring|discovering|finding|identifying|recognizing|understanding|comprehending|realizing|knowing|remembering|recalling|thinking|considering|reflecting|pondering|wondering|questioning|asking|inquiring|requesting|demanding|requiring|needing|wanting|desiring|wishing|hoping|expecting|anticipating|predicting|forecasting|planning|preparing|organizing|arranging|scheduling|timing|coordinating|managing|controlling|directing|leading|guiding|supervising|monitoring|checking|verifying|confirming|validating|testing|examining|inspecting|investigating|analyzing|evaluating|assessing|reviewing|critiquing|judging|rating|ranking|comparing|contrasting|measuring|calculating|computing|estimating|approximating|counting|numbering|quantifying|qualifying|describing|characterizing|defining|explaining|clarifying|illustrating|demonstrating|showing|revealing|exposing|uncovering|discovering|finding|locating|positioning|placing|setting|arranging|organizing|sorting|categorizing|classifying|grouping|collecting|gathering|assembling|building|constructing|creating|making|producing|generating|forming|shaping|designing|planning|developing|improving|enhancing|optimizing|perfecting|completing|finishing|achieving|accomplishing|succeeding|winning|gaining|obtaining|acquiring|receiving|getting|taking|giving|providing|offering|presenting|delivering|sending|transmitting|communicating|expressing|conveying|sharing|distributing|spreading|circulating|publishing|broadcasting|announcing|declaring|stating|saying|telling|speaking|talking|discussing|debating|arguing|persuading|convincing|influencing|affecting|impacting|changing|altering|modifying|transforming|converting|adapting|adjusting|improving|worsening|helping|harming|benefiting|damaging|protecting|threatening|supporting|opposing|agreeing|disagreeing|accepting|rejecting|approving|disapproving|liking|disliking|loving|hating|enjoying|suffering|experiencing|feeling|sensing|perceiving|noticing|observing|seeing|hearing|smelling|tasting|touching|knowing|understanding|learning|remembering|forgetting|thinking|believing|doubting|trusting|hoping|fearing|worrying|relaxing|resting|working|playing|living|dying|existing|being|becoming|staying|going|coming|moving|stopping|continuing|starting|ending|beginning|finishing|opening|closing|entering|exiting|arriving|departing|approaching|leaving|returning|visiting|traveling|journeying|exploring|discovering|finding|losing|seeking|searching|looking|watching|waiting|listening|hearing|speaking|talking|communicating|expressing|feeling|thinking|knowing|learning|understanding|growing|developing|changing|improving|working|playing|resting|sleeping|eating|drinking|breathing|living)\b/gi
                ];

                return englishPatterns.some(pattern => pattern.test(cleanText));
            };

            const getElementCategory = (element) => {
                const classList = Array.from(element.classList || []);
                const tagName = element.tagName.toLowerCase();
                const parentClasses = Array.from(element.parentElement?.classList || []);
                const id = element.id || '';

                // Comprehensive categorization
                if (classList.some(c => c.includes('testimonial')) || parentClasses.some(c => c.includes('testimonial'))) {
                    return 'testimonials';
                }
                if (classList.some(c => c.includes('award')) || parentClasses.some(c => c.includes('award'))) {
                    return 'awards';
                }
                if (classList.some(c => c.includes('form')) || tagName === 'form' || classList.some(c => c.includes('input'))) {
                    return 'forms';
                }
                if (tagName === 'button' || classList.some(c => c.includes('button')) || classList.some(c => c.includes('btn'))) {
                    return 'buttons';
                }
                if (classList.some(c => c.includes('nav')) || parentClasses.some(c => c.includes('nav'))) {
                    return 'navigation';
                }
                if (classList.some(c => c.includes('hero')) || parentClasses.some(c => c.includes('hero'))) {
                    return 'hero-section';
                }
                if (classList.some(c => c.includes('course')) || parentClasses.some(c => c.includes('course'))) {
                    return 'courses';
                }
                if (classList.some(c => c.includes('teacher')) || parentClasses.some(c => c.includes('teacher'))) {
                    return 'teachers';
                }
                if (classList.some(c => c.includes('feature')) || parentClasses.some(c => c.includes('feature'))) {
                    return 'features';
                }
                if (classList.some(c => c.includes('benefit')) || parentClasses.some(c => c.includes('benefit'))) {
                    return 'benefits';
                }
                if (classList.some(c => c.includes('stat')) || parentClasses.some(c => c.includes('stat'))) {
                    return 'statistics';
                }
                if (classList.some(c => c.includes('footer')) || parentClasses.some(c => c.includes('footer'))) {
                    return 'footer';
                }
                if (classList.some(c => c.includes('contact')) || parentClasses.some(c => c.includes('contact'))) {
                    return 'contact';
                }
                if (classList.some(c => c.includes('faq')) || parentClasses.some(c => c.includes('faq'))) {
                    return 'faq';
                }
                if (classList.some(c => c.includes('price')) || parentClasses.some(c => c.includes('price'))) {
                    return 'pricing';
                }
                if (classList.some(c => c.includes('modal')) || parentClasses.some(c => c.includes('modal'))) {
                    return 'modals';
                }
                if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
                    return 'headings';
                }
                if (tagName === 'p') {
                    return 'paragraphs';
                }
                if (tagName === 'a') {
                    return 'links';
                }
                if (tagName === 'li') {
                    return 'list-items';
                }
                if (classList.some(c => c.includes('text')) || tagName === 'span' || tagName === 'div') {
                    return 'text-content';
                }

                return 'other';
            };

            const getPriorityLevel = (element, category) => {
                const classList = Array.from(element.classList || []);
                const tagName = element.tagName.toLowerCase();
                const text = element.textContent?.trim() || '';

                // High priority: Visible, important content
                if (['h1', 'h2', 'h3'].includes(tagName)) return 'high';
                if (category === 'buttons' && text.length > 0) return 'high';
                if (category === 'navigation') return 'high';
                if (category === 'hero-section') return 'high';
                if (classList.some(c => c.includes('hero'))) return 'high';
                if (classList.some(c => c.includes('main'))) return 'high';
                if (classList.some(c => c.includes('primary'))) return 'high';

                // Medium priority: Content sections
                if (['h4', 'h5', 'h6'].includes(tagName)) return 'medium';
                if (category === 'courses') return 'medium';
                if (category === 'teachers') return 'medium';
                if (category === 'features') return 'medium';
                if (category === 'testimonials') return 'medium';
                if (category === 'forms') return 'medium';
                if (text.length > 100) return 'medium';

                // Low priority: Utility content
                if (category === 'footer') return 'low';
                if (classList.some(c => c.includes('util'))) return 'low';
                if (text.length < 20) return 'low';

                return 'medium';
            };

            const getSectionContext = (element) => {
                let current = element;
                while (current && current.parentElement) {
                    const parent = current.parentElement;
                    if (parent.id) return parent.id;

                    const classList = Array.from(parent.classList || []);
                    const sectionClasses = ['section', 'container', 'wrapper', 'block', 'component'];
                    const foundSection = classList.find(c => sectionClasses.some(s => c.includes(s)));
                    if (foundSection) return foundSection;

                    current = parent;
                }
                return 'unknown-section';
            };

            // Get all text-containing elements
            const allElements = document.querySelectorAll('*');
            const textElements = Array.from(allElements).filter(el => {
                const text = el.textContent?.trim();
                if (!text || text.length === 0) return false;

                // Skip elements that only contain child element text
                const directText = Array.from(el.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .join(' ')
                    .trim();

                return directText.length > 0;
            });

            console.log(`Found ${textElements.length} text-containing elements`);

            textElements.forEach((element, index) => {
                const text = element.textContent?.trim() || '';
                if (text.length === 0) return;

                const category = getElementCategory(element);
                const priority = getPriorityLevel(element, category);
                const section = getSectionContext(element);
                const dataI18n = element.getAttribute('data-i18n') || 'none';

                const elementInfo = {
                    index: index + 1,
                    text: text.substring(0, 200), // Limit text length for readability
                    fullText: text,
                    tagName: element.tagName.toLowerCase(),
                    classes: Array.from(element.classList || []),
                    id: element.id || '',
                    dataI18n: dataI18n,
                    category: category,
                    priority: priority,
                    section: section,
                    isRussian: isRussian(text),
                    isEnglish: isEnglish(text),
                    xpath: getElementXPath(element),
                    parent: {
                        tagName: element.parentElement?.tagName.toLowerCase() || '',
                        classes: Array.from(element.parentElement?.classList || []),
                        id: element.parentElement?.id || ''
                    }
                };

                if (elementInfo.isRussian) {
                    results.translatedElements.push(elementInfo);
                    results.summary.translatedCount++;
                } else if (elementInfo.isEnglish) {
                    results.untranslatedElements.push(elementInfo);
                    results.summary.untranslatedCount++;
                } else {
                    // Neither clearly Russian nor English - might be symbols, numbers, etc.
                    // Still count as potentially needing translation if it contains meaningful text
                    if (text.match(/[a-zA-Z]/)) {
                        results.untranslatedElements.push({...elementInfo, isEnglish: true});
                        results.summary.untranslatedCount++;
                    }
                }

                results.summary.totalElements++;

                // Count by category
                if (!results.summary.categories[category]) {
                    results.summary.categories[category] = { total: 0, untranslated: 0, translated: 0 };
                }
                results.summary.categories[category].total++;
                if (elementInfo.isRussian) {
                    results.summary.categories[category].translated++;
                } else {
                    results.summary.categories[category].untranslated++;
                }

                // Group by section
                if (!results.sections[section]) {
                    results.sections[section] = {
                        untranslated: [],
                        translated: [],
                        summary: { total: 0, untranslated: 0, translated: 0 }
                    };
                }
                results.sections[section].summary.total++;
                if (elementInfo.isRussian) {
                    results.sections[section].translated.push(elementInfo);
                    results.sections[section].summary.translated++;
                } else {
                    results.sections[section].untranslated.push(elementInfo);
                    results.sections[section].summary.untranslated++;
                }
            });

            function getElementXPath(element) {
                if (element.id) {
                    return `//*[@id="${element.id}"]`;
                }

                let path = '';
                for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
                    let index = 0;
                    for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                        if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
                        if (sibling.nodeName === element.nodeName) ++index;
                    }

                    const tagName = element.nodeName.toLowerCase();
                    const pathIndex = index ? `[${index + 1}]` : '';
                    path = `/${tagName}${pathIndex}${path}`;
                }

                return path;
            }

            return results;
        });

        // Generate comprehensive report
        const report = {
            timestamp: new Date().toISOString(),
            url: page.url(),
            summary: analysisResults.summary,
            categorizedBreakdown: {},
            prioritizedList: {
                high: [],
                medium: [],
                low: []
            },
            sectionBreakdown: analysisResults.sections,
            detailedUntranslatedElements: analysisResults.untranslatedElements,
            translationProgress: {
                percentage: Math.round((analysisResults.summary.translatedCount / analysisResults.summary.totalElements) * 100),
                remaining: analysisResults.summary.untranslatedCount,
                completed: analysisResults.summary.translatedCount
            },
            recommendations: []
        };

        // Categorize untranslated elements
        analysisResults.untranslatedElements.forEach(element => {
            if (!report.categorizedBreakdown[element.category]) {
                report.categorizedBreakdown[element.category] = [];
            }
            report.categorizedBreakdown[element.category].push(element);

            // Add to priority lists
            report.prioritizedList[element.priority].push(element);
        });

        // Generate recommendations
        const categories = Object.keys(report.categorizedBreakdown);
        categories.forEach(category => {
            const count = report.categorizedBreakdown[category].length;
            if (count > 0) {
                report.recommendations.push({
                    category: category,
                    count: count,
                    priority: report.categorizedBreakdown[category][0].priority,
                    action: `Translate ${count} ${category} elements`,
                    estimatedTime: `${Math.ceil(count / 10)} minutes`
                });
            }
        });

        // Sort recommendations by priority and count
        report.recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority] || 0;
            const bPriority = priorityOrder[b.priority] || 0;

            if (aPriority !== bPriority) {
                return bPriority - aPriority; // Higher priority first
            }
            return b.count - a.count; // More items first
        });

        console.log('📊 Ultra-Comprehensive Translation Scan Results:');
        console.log(`Total Elements: ${report.summary.totalElements}`);
        console.log(`Translated: ${report.summary.translatedCount} (${report.translationProgress.percentage}%)`);
        console.log(`Untranslated: ${report.summary.untranslatedCount}`);
        console.log('\n🎯 Priority Breakdown:');
        console.log(`High Priority: ${report.prioritizedList.high.length} elements`);
        console.log(`Medium Priority: ${report.prioritizedList.medium.length} elements`);
        console.log(`Low Priority: ${report.prioritizedList.low.length} elements`);

        console.log('\n📋 Category Breakdown:');
        Object.entries(report.summary.categories).forEach(([category, stats]) => {
            console.log(`${category}: ${stats.untranslated}/${stats.total} untranslated`);
        });

        console.log('\n🚀 Recommended Action Plan:');
        report.recommendations.slice(0, 10).forEach((rec, index) => {
            console.log(`${index + 1}. ${rec.action} (${rec.priority} priority, ~${rec.estimatedTime})`);
        });

        // Save detailed report
        const reportJson = JSON.stringify(report, null, 2);
        console.log('\n💾 Saving detailed report to ultra-translation-report.json');

        // Return the report for file saving
        return report;

    } catch (error) {
        console.error('❌ Error during scan:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the scan
runUltraDetailedTranslationScan()
    .then(report => {
        // Save the report to a JSON file
        const fs = require('fs');
        fs.writeFileSync('ultra-translation-report.json', JSON.stringify(report, null, 2));
        console.log('\n✅ Ultra-comprehensive scan completed!');
        console.log('📄 Detailed report saved to: ultra-translation-report.json');
        console.log('\n🎯 Next Steps:');
        console.log('1. Review high-priority untranslated elements first');
        console.log('2. Focus on categories with most untranslated content');
        console.log('3. Use section breakdown for targeted fixes');
        console.log('4. Deploy sub-agents for each major category');
    })
    .catch(error => {
        console.error('❌ Scan failed:', error);
        process.exit(1);
    });