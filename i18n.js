/* ==========================================================================
   CRYPTO INFO | TRADING — bilingual RU/EN toggle
   --------------------------------------------------------------------------
   Single source of truth for every translatable string on the public site
   (index.html) and the student cabinet (cabinet-4d70bc8a.html).

   HOW IT WORKS
   - Every translatable element carries data-i18n="some.key" (or
     data-i18n-placeholder / data-i18n-aria for attributes).
   - TRANSLATIONS[key] = { ru: "<html>", en: "<html>" } — values are stored
     as full innerHTML (including any nested tags/icons) and are applied
     with element.innerHTML = ..., never textContent, so nested markup
     (br, em, icon spans, etc.) survives the swap untouched.
   - The active language is persisted in localStorage under "site_lang"
     and re-applied automatically on every page load (default: "ru").
   - cabinet-4d70bc8a.js listens for the "cit:langchange" event (dispatched
     below) to re-render the pieces of the lesson catalog it controls
     dynamically (progress counter, watched-state button, video
     placeholder, generic lesson description). Module/lesson titles
     ("Модуль 1", "Урок 1.1") are placeholder course content and are left
     as-is in both languages on purpose.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "site_lang";
  var DEFAULT_LANG = "ru";

  var TRANSLATIONS = {
    /* ---------------------------------------------------------------- meta */
    "meta.title": {
      ru: `CRYPTO INFO | TRADING — меньше шума, больше сигнала`,
      en: `CRYPTO INFO | TRADING — Less Noise, More Signal`
    },
    "meta.description": {
      ru: `CRYPTO INFO | TRADING — рыночная аналитика, торговые сценарии и управление риском без лишнего шума.`,
      en: `CRYPTO INFO | TRADING — market analysis, trading scenarios, and risk management without the noise.`
    },

    /* ----------------------------------------------------------------- nav */
    "nav.skipLink": { ru: `Перейти к содержанию`, en: `Skip to content` },
    "nav.brandAria": {
      ru: `CRYPTO INFO | TRADING — на главную`,
      en: `CRYPTO INFO | TRADING — Home`
    },
    "nav.menuOpenAria": { ru: `Открыть меню`, en: `Open menu` },
    "nav.menuCloseAria": { ru: `Закрыть меню`, en: `Close menu` },
    "nav.ariaLabel": { ru: `Основная навигация`, en: `Main navigation` },
    "nav.about": { ru: `О проекте`, en: `About` },
    "nav.formats": { ru: `Форматы`, en: `Formats` },
    "nav.method": { ru: `Подход`, en: `Method` },
    "nav.education": { ru: `Обучение`, en: `Education` },
    "nav.author": { ru: `Автор`, en: `Author` },
    "nav.socials": { ru: `Соцсети`, en: `Social` },
    "nav.results": { ru: `Живые результаты`, en: `Live Results` },
    "nav.contact": { ru: `Связаться`, en: `Contact` },
    "nav.cta": {
      ru: `Открыть Telegram <span aria-hidden="true">↗︎</span>`,
      en: `Open Telegram <span aria-hidden="true">↗︎</span>`
    },

    /* ---------------------------------------------------------------- hero */
    "hero.eyebrow": {
      ru: `<span></span> Аналитика рынка / живая торговля`,
      en: `<span></span> Market analysis / live trading`
    },
    "hero.title": {
      ru: `Меньше шума.<br><em>Больше сигнала.</em>`,
      en: `Less noise.<br><em>More signal.</em>`
    },
    "hero.lead": {
      ru: `Авторский взгляд на рынок, понятные торговые сценарии и дисциплина риска — в одной системе.`,
      en: `The founder's market perspective, clear trading scenarios, and risk discipline — in one system.`
    },
    "hero.identity.founderLabel": { ru: `Основатель и автор`, en: `Founder & Author` },
    "hero.identity.statusLabel": { ru: `Статус`, en: `Status` },
    "hero.identity.statusValue": { ru: `Официальный партнёр BingX`, en: `Official BingX Partner` },
    "hero.actions.primary": {
      ru: `Перейти в канал <span aria-hidden="true">↗︎</span>`,
      en: `Go to the channel <span aria-hidden="true">↗︎</span>`
    },
    "hero.actions.secondary": {
      ru: `Как устроен разбор <span aria-hidden="true">↓︎</span>`,
      en: `How the breakdown works <span aria-hidden="true">↓︎</span>`
    },
    "hero.signalRow.ariaLabel": { ru: `Основные принципы проекта`, en: `Core principles of the project` },
    "hero.signalRow.market": { ru: `Рынок`, en: `Market` },
    "hero.signalRow.scenario": { ru: `Сценарий`, en: `Scenario` },
    "hero.signalRow.risk": { ru: `Риск`, en: `Risk` },
    "hero.signalRow.action": { ru: `Действие`, en: `Action` },

    /* ------------------------------------------------------------- ticker */
    "market.ticker.scenario": { ru: `СЦЕНАРИЙ`, en: `SCENARIO` },
    "market.ticker.risk": { ru: `РИСК`, en: `RISK` },
    "market.ticker.liquidity": { ru: `ЛИКВИДНОСТЬ`, en: `LIQUIDITY` },

    /* --------------------------------------------------------------- about */
    "about.eyebrow": { ru: `<span></span> О проекте`, en: `<span></span> About the project` },
    "about.title": {
      ru: `Система мышления,<br>а не поток сигналов`,
      en: `A thinking system,<br>not a stream of signals`
    },
    "about.lead": {
      ru: `Здесь важна не громкость прогноза, а логика решения: что происходит, почему это имеет значение и где сценарий перестаёт работать.`,
      en: `What matters here isn't the loudness of a forecast, but the logic of a decision: what's happening, why it matters, and where the scenario stops working.`
    },
    "about.card1.title": { ru: `Контекст`, en: `Context` },
    "about.card1.desc": {
      ru: `Факты, уровни и структура рынка без перегруза терминологией.`,
      en: `Facts, levels, and market structure without jargon overload.`
    },
    "about.card2.title": { ru: `Сценарий`, en: `Scenario` },
    "about.card2.desc": {
      ru: `Условия входа, цели и понятная логика дальнейших действий.`,
      en: `Entry conditions, targets, and a clear logic for what comes next.`
    },
    "about.card3.title": { ru: `Риск`, en: `Risk` },
    "about.card3.desc": {
      ru: `Стоп, отмена идеи и размер позиции — часть каждого решения.`,
      en: `Stop-loss, invalidation, and position size — part of every decision.`
    },

    /* ------------------------------------------------------------ formats */
    "formats.eyebrow": { ru: `<span></span> Контент-система`, en: `<span></span> Content system` },
    "formats.title": {
      ru: `Пять форматов.<br>Один визуальный код.`,
      en: `Five formats.<br>One visual code.`
    },
    "formats.lead": {
      ru: `Каждый материал сразу сообщает, что перед вами: аналитика, торговая идея, риск, новость или недельный итог.`,
      en: `Every post tells you at a glance what it is: analysis, a trade idea, risk, news, or a weekly wrap-up.`
    },
    "formats.card1.title": { ru: `Рынок`, en: `Market` },
    "formats.card1.desc": { ru: `Структура, импульс и ключевые уровни.`, en: `Structure, momentum, and key levels.` },
    "formats.card2.title": { ru: `Сценарий`, en: `Scenario` },
    "formats.card2.desc": { ru: `Вход, отмена идеи и возможные цели.`, en: `Entry, invalidation, and potential targets.` },
    "formats.card3.title": { ru: `Риск`, en: `Risk` },
    "formats.card3.desc": { ru: `Ликвидность, плечо и защита позиции.`, en: `Liquidity, leverage, and position protection.` },
    "formats.card4.title": { ru: `Новости`, en: `News` },
    "formats.card4.desc": {
      ru: `Не просто событие, а его значение для трейдера.`,
      en: `Not just the event — what it means for a trader.`
    },
    "formats.card5.title": { ru: `Итоги недели`, en: `Weekly Wrap-up` },
    "formats.card5.desc": {
      ru: `Что сработало, что изменилось и где искать следующий сетап.`,
      en: `What worked, what changed, and where to look for the next setup.`
    },
    "formats.card5.mon": { ru: `ПН`, en: `MON` },
    "formats.card5.wed": { ru: `СР`, en: `WED` },
    "formats.card5.fri": { ru: `ПТ`, en: `FRI` },

    /* ----------------------------------------------------------- manifesto */
    "manifesto.quote": {
      ru: `«Факт без вывода — просто шум.<br><em>Вывод без риска — просто мнение.</em>»`,
      en: `«A fact without a conclusion is just noise.<br><em>A conclusion without risk is just an opinion.</em>»`
    },
    "manifesto.label": { ru: `Принцип CRYPTO INFO`, en: `The CRYPTO INFO Principle` },

    /* --------------------------------------------------------------- method */
    "method.eyebrow": { ru: `<span></span> Метод`, en: `<span></span> Method` },
    "method.title": { ru: `От факта<br>к решению`, en: `From fact<br>to decision` },
    "method.lead": {
      ru: `Каждый разбор проходит одну и ту же проверяемую цепочку. Это помогает отделять эмоцию от торгового плана.`,
      en: `Every breakdown follows the same verifiable chain. It helps separate emotion from the trading plan.`
    },
    "method.step1.title": { ru: `Крючок`, en: `Hook` },
    "method.step1.desc": { ru: `Что требует внимания`, en: `What deserves attention` },
    "method.step2.title": { ru: `Факт`, en: `Fact` },
    "method.step2.desc": { ru: `Что произошло`, en: `What happened` },
    "method.step3.title": { ru: `Значение`, en: `Meaning` },
    "method.step3.desc": { ru: `Почему это важно`, en: `Why it matters` },
    "method.step4.title": { ru: `Сценарий`, en: `Scenario` },
    "method.step4.desc": { ru: `Что можно делать`, en: `What can be done` },
    "method.step5.title": { ru: `Риск`, en: `Risk` },
    "method.step5.desc": { ru: `Где идея отменяется`, en: `Where the idea is invalidated` },
    "method.step6.title": { ru: `Действие`, en: `Action` },
    "method.step6.desc": { ru: `Следующий шаг`, en: `The next step` },

    /* ------------------------------------------------------------ education */
    "education.eyebrow": { ru: `<span></span> Авторское обучение`, en: `<span></span> Founder-Led Education` },
    "education.title": {
      ru: `От первых шагов<br><em>до уровня PRO</em>`,
      en: `From first steps<br><em>to PRO level</em>`
    },
    "education.lead": {
      ru: `Системная программа Alexey Pugachev о работе на рынке, построении прибыли и контроле рисков — с поддержкой на каждом этапе.`,
      en: `Alexey Pugachev's systematic program on working the market, building profit, and controlling risk — with support at every stage.`
    },

    "education.card1.format": { ru: `С куратором`, en: `With a Mentor` },
    "education.card1.lead": {
      ru: `Авторское модульное обучение, выстроенное от базовых знаний до профессионального уровня.`,
      en: `A founder-designed modular course built from foundational knowledge to a professional level.`
    },
    "education.card1.stat1Label": { ru: `модулей`, en: `modules` },
    "education.card1.stat2Label": { ru: `видеоуроков`, en: `video lessons` },
    "education.card1.list1": {
      ru: `Обучение в закрытом Telegram-чате`,
      en: `Training in a private Telegram chat`
    },
    "education.card1.list2": {
      ru: `Сопровождение действующего куратора`,
      en: `Support from an active mentor`
    },
    "education.card1.list3": {
      ru: `Неограниченная по времени поддержка во время и после обучения`,
      en: `Unlimited-time support during and after the course`
    },
    "education.card1.list4": {
      ru: `Практика работы, построения прибыли и контроля рисков`,
      en: `Hands-on practice in trading, building profit, and risk control`
    },
    "education.priceLabel1": { ru: `Специальная стоимость`, en: `Special Price` },

    "education.card2.format": { ru: `Индивидуально`, en: `One-on-One` },
    "education.card2.lead": {
      ru: `Полная программа PRO 3.0 в персональном формате: все уроки проходят онлайн на живых созвонах.`,
      en: `The full PRO 3.0 program in a personal format: every lesson happens live, online.`
    },
    "education.card2.stat1Label": { ru: `формат`, en: `format` },
    "education.card2.stat2Label": { ru: `онлайн-созвоны`, en: `online calls` },
    "education.card2.list1": {
      ru: `Индивидуальное прохождение всех тем программы`,
      en: `A personal walkthrough of every topic in the program`
    },
    "education.card2.list2": {
      ru: `Живые онлайн-занятия и разбор вопросов`,
      en: `Live online sessions and Q&A`
    },
    "education.card2.list3": {
      ru: `Персональная обратная связь и поддержка без ограничения по времени`,
      en: `Personal feedback and unlimited-time support`
    },
    "education.card2.list4": {
      ru: `Фокус на работе, прибыли и системном контроле рисков`,
      en: `A focus on trading, profit, and systematic risk control`
    },
    "education.priceLabel2": { ru: `Индивидуальный формат`, en: `Personal Format` },

    "education.status.title": { ru: `Приём временно закрыт`, en: `Enrollment Temporarily Closed` },
    "education.status.desc": {
      ru: `Дозаписываем программу — скоро откроем набор`,
      en: `We're finishing the program — enrollment reopens soon`
    },

    "education.aftercare.label": { ru: `Путь продолжается`, en: `The Journey Continues` },
    "education.aftercare.text": {
      ru: `Каждый ученик после обучения никогда не остаётся один. Настоящее начало пути открывается после завершения программы — в закрытом VIP Community для трейдеров.`,
      en: `After the course, no student is ever left alone. The real beginning of the journey starts after the program — inside the closed VIP Community for traders.`
    },
    "education.aftercare.cta": {
      ru: `Перейти к VIP Community <span aria-hidden="true">↓︎</span>`,
      en: `Go to VIP Community <span aria-hidden="true">↓︎</span>`
    },

    "education.reviews.label": { ru: `Живые отзывы учеников`, en: `Real Student Reviews` },
    "education.reviews.more": {
      ru: `Читать больше отзывов <span aria-hidden="true">↗︎</span>`,
      en: `Read more reviews <span aria-hidden="true">↗︎</span>`
    },
    "education.statsAria1": { ru: `Состав программы`, en: `Program contents` },
    "education.statsAria2": { ru: `Формат программы`, en: `Program format` },
    "education.priceAria": { ru: `Стоимость тарифа`, en: `Plan price` },
    "education.aftercareAria": { ru: `Поддержка после обучения`, en: `Support after the course` },
    "education.reviewsAria": { ru: `Отзывы учеников`, en: `Student reviews` },
    "education.note": {
      ru: `Оплата доступна только в USDT. Перед переводом обязательно проверьте выбранную сеть.`,
      en: `Payment is accepted in USDT only. Before transferring, make sure to double-check the selected network.`
    },

    /* ------------------------------------------------------------ payment */
    "payment.closeAria": { ru: `Закрыть окно оплаты`, en: `Close payment window` },
    "payment.title": { ru: `Оплата обучения`, en: `Course Payment` },
    "payment.step1": { ru: `<b>01</b> Выберите сеть`, en: `<b>01</b> Choose a network` },
    "payment.step2": { ru: `<b>02</b> Переведите точную сумму`, en: `<b>02</b> Send the exact amount` },
    "payment.step3": { ru: `<b>03</b> Отправьте TXID и скриншот`, en: `<b>03</b> Send the TXID and screenshot` },
    "payment.networksAria": { ru: `Выберите сеть USDT`, en: `Choose a USDT network` },
    "payment.stepsAria": { ru: `Порядок оплаты`, en: `Payment steps` },
    "payment.copyAddress": { ru: `Скопировать адрес`, en: `Copy address` },
    "payment.proofHead.kicker": { ru: `ПОДТВЕРЖДЕНИЕ ПЕРЕВОДА`, en: `PAYMENT CONFIRMATION` },
    "payment.proofHead.title": { ru: `Отправьте данные для проверки`, en: `Submit your details for verification` },
    "payment.proofHead.desc": {
      ru: `После отправки формы откроется личный Telegram Alexey Pugachev.`,
      en: `After submitting the form, Alexey Pugachev's personal Telegram will open.`
    },
    "payment.field.telegram": { ru: `Ваш Telegram username`, en: `Your Telegram username` },
    "payment.field.txid": { ru: `TXID / хеш транзакции`, en: `TXID / transaction hash` },
    "payment.field.txidPlaceholder": { ru: `Вставьте идентификатор перевода`, en: `Paste the transfer identifier` },
    "payment.field.screenshotLabel": {
      ru: `Скриншот перевода <b>обязательно</b>`,
      en: `Screenshot of the transfer <b>required</b>`
    },
    "payment.field.fileDefault": { ru: `Выбрать PNG, JPG или WEBP`, en: `Choose PNG, JPG, or WEBP` },
    "payment.field.fileHint": { ru: `Не более 10 МБ`, en: `Up to 10 MB` },
    "payment.field.comment": { ru: `Комментарий <small>необязательно</small>`, en: `Comment <small>optional</small>` },
    "payment.field.commentPlaceholder": {
      ru: `Имя отправителя или дополнительная информация`,
      en: `Sender's name or additional information`
    },
    "payment.consent": {
      ru: `Согласен на передачу платёжных данных и скриншота через FormSubmit для проверки оплаты.`,
      en: `I agree to send my payment details and screenshot via FormSubmit for verification.`
    },
    "payment.submit": {
      ru: `Отправить подтверждение <span aria-hidden="true">→︎</span>`,
      en: `Submit confirmation <span aria-hidden="true">→︎</span>`
    },
    "payment.privacyNote": {
      ru: `Никогда не отправляйте seed-фразу, пароль или приватный ключ.`,
      en: `Never send your seed phrase, password, or private key.`
    },

    /* --------------------------------------------------------------- author */
    "author.eyebrow": { ru: `<span></span> Основатель и автор`, en: `<span></span> Founder & Author` },
    "author.role": {
      ru: `Основатель CRYPTO INFO | TRADING<br>и официальный партнёр биржи BingX`,
      en: `Founder of CRYPTO INFO | TRADING<br>and official partner of the BingX exchange`
    },
    "author.lead": {
      ru: `Личный рыночный комментарий, прозрачная логика сценариев и дисциплина риска превращают поток информации в понятную систему действий.`,
      en: `Personal market commentary, transparent scenario logic, and risk discipline turn a flood of information into a clear system of action.`
    },
    "author.point1": { ru: `<i>✓</i> Прямой язык`, en: `<i>✓</i> Straight talk` },
    "author.point2": { ru: `<i>✓</i> Прозрачная логика`, en: `<i>✓</i> Transparent logic` },
    "author.point3": { ru: `<i>✓</i> Риск до результата`, en: `<i>✓</i> Risk before results` },
    "author.actions.primary": {
      ru: `Читать канал <span aria-hidden="true">↗︎</span>`,
      en: `Read the channel <span aria-hidden="true">↗︎</span>`
    },
    "author.actions.secondary": {
      ru: `Партнёрство BingX <span aria-hidden="true">↓︎</span>`,
      en: `BingX Partnership <span aria-hidden="true">↓︎</span>`
    },

    /* --------------------------------------------------------------- bingx */
    "partner.eyebrow": { ru: `<span></span> Официальное партнёрство`, en: `<span></span> Official Partnership` },
    "partner.title": {
      ru: `Торговая инфраструктура<br><em>для участников сообщества</em>`,
      en: `Trading infrastructure<br><em>for community members</em>`
    },
    "partner.lead": {
      ru: `Alexey Pugachev и CRYPTO INFO | TRADING являются официальными партнёрами BingX. Партнёрская регистрация — первый шаг для доступа в закрытое VIP Community.`,
      en: `Alexey Pugachev and CRYPTO INFO | TRADING are official BingX partners. Registering through the partner link is the first step to access the closed VIP Community.`
    },
    "partner.cta": {
      ru: `Зарегистрироваться на BingX <span aria-hidden="true">↗︎</span>`,
      en: `Register on BingX <span aria-hidden="true">↗︎</span>`
    },
    "partner.cardAria": { ru: `Статус партнёрства BingX`, en: `BingX partnership status` },
    "partner.cardText": {
      ru: `Партнёрская ссылка<br>CRYPTO INFO | TRADING`,
      en: `Partner link<br>CRYPTO INFO | TRADING`
    },

    /* ----------------------------------------------------------------- vip */
    "vip.eyebrow": { ru: `<span></span> Закрытое сообщество`, en: `<span></span> Private Community` },
    "vip.title": { ru: `VIP Community<br><em>для трейдеров</em>`, en: `VIP Community<br><em>for traders</em>` },
    "vip.lead": {
      ru: `Среда для тех, кто хочет торговать не в одиночку: видеть пульс рынка, обсуждать идеи и работать по понятным сценариям.`,
      en: `A space for traders who don't want to go it alone: feel the market's pulse, discuss ideas, and work from clear scenarios.`
    },
    "vip.card1.title": { ru: `Умные сигналы`, en: `Smart Signals` },
    "vip.card1.desc": {
      ru: `Ежедневные рекомендации для фьючерсов — быстро, чётко и по делу.`,
      en: `Daily futures recommendations — fast, clear, and to the point.`
    },
    "vip.card2.title": { ru: `Пульс рынка`, en: `Market Pulse` },
    "vip.card2.desc": {
      ru: `Оперативные сводки и актуальные точки внимания для трейдера.`,
      en: `Timely updates and key points every trader should watch.`
    },
    "vip.card3.title": { ru: `Гибкие стратегии`, en: `Flexible Strategies` },
    "vip.card3.desc": {
      ru: `Сценарии для спота, среднесрока и разных торговых горизонтов.`,
      en: `Scenarios for spot, mid-term, and different trading horizons.`
    },
    "vip.card4.title": { ru: `Закрытый чат`, en: `Private Chat` },
    "vip.card4.desc": {
      ru: `Общение с единомышленниками, обмен идеями и живое комьюнити.`,
      en: `Connect with like-minded traders, share ideas, and a living community.`
    },
    "vip.card5.title": { ru: `Торговля вместе`, en: `Trading Together` },
    "vip.card5.desc": {
      ru: `Совместный скальпинг, сопровождение по сделкам и поддержка команды.`,
      en: `Group scalping, trade support, and backing from the team.`
    },
    "vip.card6.title": { ru: `Бонусы BingX`, en: `BingX Perks` },
    "vip.card6.desc": {
      ru: `Скидки на комиссии, перенос VIP-статуса и регулярные активности.`,
      en: `Fee discounts, VIP status transfer, and regular activities.`
    },

    "join.eyebrow": { ru: `<span></span> Как присоединиться`, en: `<span></span> How to Join` },
    "join.title": { ru: `Три шага до закрытого сообщества`, en: `Three steps to the private community` },
    "join.lead": {
      ru: `Условие вступления — регистрация на BingX по партнёрской ссылке CRYPTO INFO | TRADING.`,
      en: `Membership requires registering on BingX via the CRYPTO INFO | TRADING partner link.`
    },
    "join.step1.title": { ru: `Регистрация`, en: `Registration` },
    "join.step1.desc": {
      ru: `Создайте аккаунт BingX по официальной партнёрской ссылке.`,
      en: `Create a BingX account using the official partner link.`
    },
    "join.step2.title": { ru: `Ваш UID`, en: `Your UID` },
    "join.step2.desc": {
      ru: `Скопируйте идентификатор пользователя в личном кабинете BingX.`,
      en: `Copy your user ID from your BingX account.`
    },
    "join.step3.title": { ru: `Проверка доступа`, en: `Access Verification` },
    "join.step3.desc": {
      ru: `Отправьте UID в Telegram-бот VIP Community.`,
      en: `Send your UID to the VIP Community Telegram bot.`
    },
    "join.action1": {
      ru: `Регистрация на BingX <span aria-hidden="true">↗︎</span>`,
      en: `Register on BingX <span aria-hidden="true">↗︎</span>`
    },
    "join.action2": {
      ru: `Отправить UID в бот <span aria-hidden="true">↗︎</span>`,
      en: `Send UID to the bot <span aria-hidden="true">↗︎</span>`
    },
    "join.action3": {
      ru: `Оригинальный пост <span aria-hidden="true">↗︎</span>`,
      en: `Original post <span aria-hidden="true">↗︎</span>`
    },

    /* ------------------------------------------------------------- socials */
    "socials.eyebrow": { ru: `<span></span> Медиа и соцсети`, en: `<span></span> Media & Social` },
    "socials.title": {
      ru: `Рынок — в видео.<br><em>Личность — в кадре.</em>`,
      en: `The market — on video.<br><em>The person — on camera.</em>`
    },
    "socials.lead": {
      ru: `Подписывайтесь на площадки Alexey Pugachev: новые рыночные разборы на YouTube и личный контент о трейдинге в Instagram.`,
      en: `Follow Alexey Pugachev's channels: new market breakdowns on YouTube and personal trading content on Instagram.`
    },
    "socials.shortcutsAria": { ru: `Социальные сети`, en: `Social media` },
    "socials.youtubeLatestAria": {
      ru: `Открыть последний выпуск CRYPTO INFO на YouTube`,
      en: `Open the latest CRYPTO INFO episode on YouTube`
    },
    "socials.youtubeAria": { ru: `Открыть YouTube-канал CRYPTO INFO`, en: `Open the CRYPTO INFO YouTube channel` },
    "socials.instagramAria": {
      ru: `Открыть Instagram Alexey Pugachev`,
      en: `Open Alexey Pugachev's Instagram`
    },
    "socials.youtubeLocalBadge": { ru: `Смотреть на YouTube ↗︎`, en: `Watch on YouTube ↗︎` },
    "socials.youtube.desc": {
      ru: `Карточка подключена к официальной ленте канала. Новый выпуск автоматически появится здесь и откроется на YouTube без ошибок встроенного плеера.`,
      en: `This card is connected to the channel's official feed. New episodes appear here automatically and open on YouTube without embedded-player issues.`
    },
    "socials.youtube.watch": {
      ru: `Смотреть выпуск <span aria-hidden="true">↗︎</span>`,
      en: `Watch the episode <span aria-hidden="true">↗︎</span>`
    },
    "socials.youtube.openChannel": {
      ru: `Открыть канал <span aria-hidden="true">↗︎</span>`,
      en: `Open the channel <span aria-hidden="true">↗︎</span>`
    },
    "socials.iphoneAria": {
      ru: `Instagram-профиль Alexey Pugachev в стилизованном iPhone 17 Pro Max`,
      en: `Alexey Pugachev's Instagram profile in a styled iPhone 17 Pro Max`
    },
    "socials.instagram.label": { ru: `Личный профиль основателя`, en: `Founder's personal profile` },
    "socials.instagram.title": {
      ru: `Трейдинг, работа и жизнь вне графиков`,
      en: `Trading, work, and life beyond the charts`
    },
    "socials.instagram.cta": {
      ru: `Перейти в Instagram <span aria-hidden="true">↗︎</span>`,
      en: `Go to Instagram <span aria-hidden="true">↗︎</span>`
    },

    /* -------------------------------------------------------------- results */
    "results.eyebrow": { ru: `<span></span> Живые результаты`, en: `<span></span> Live Results` },
    "results.title": {
      ru: `Живая картина<br><em>всегда лучше воображения</em>`,
      en: `A real picture<br><em>always beats imagination</em>`
    },
    "results.lead": {
      ru: `Скриншоты сделок и слова учеников — прямо из закрытого Telegram-канала с отзывами. Без монтажа и постановки: только реальные сделки и реальные люди.`,
      en: `Trade screenshots and student words — straight from the private Telegram review channel. No editing, no staging: only real trades and real people.`
    },
    "results.sourceLink": {
      ru: `Все отзывы и результаты в Telegram <span aria-hidden="true">↗︎</span>`,
      en: `All reviews and results on Telegram <span aria-hidden="true">↗︎</span>`
    },

    /* ---------------------------------------------------------- testimonials */
    "testimonial.sourceLabel": { ru: `Отзыв в Telegram`, en: `Review on Telegram` },
    "testimonial.vadim": {
      ru: `«Обучение классное, всё доходчиво объясняют в свободной форме, без воды и заумных слов — простым языком для любого уровня знаний. Материал полезный: от стратегий до контроля эмоций.»`,
      en: `«The course is great — everything is explained clearly in a relaxed way, no fluff or fancy words, plain language for any knowledge level. The material is useful: from strategies to emotional control.»`
    },
    "testimonial.revan": {
      ru: `«Обучение длилось 4 месяца, и они пролетели незаметно. Лёша объяснял всё по несколько раз — у него большой талант и настоящее стремление обучать и помогать людям. Позже я сам стал частью команды.»`,
      en: `«The course lasted 4 months, and they flew by. Lyosha explained everything several times over — he has real talent and a genuine drive to teach and help people. Later I became part of the team myself.»`
    },
    "testimonial.alexandr": {
      ru: `«Хочу поблагодарить от души за шикарное обучение. Всё подробно, доступно и без лишней воды — только то, что реально работает. Объясняет снова и снова, пока не поймёшь. Я был полным нулём, а теперь вместе с командой зарабатываю на рынке.»`,
      en: `«I want to sincerely thank you for an amazing course. Everything is detailed, clear, and free of fluff — only what actually works. He explains it again and again until you get it. I started at zero, and now I'm making money on the market together with the team.»`
    },
    "testimonial.vladislav": {
      ru: `«Пришёл на курс с нулевыми знаниями о крипте. Обучение подробное, с повторением по всем темам и ответами на все вопросы. Спустя три месяца уже открываю свои сделки и делаю прибыль. Очень помогает комьюнити и сделки от самого Лёши.»`,
      en: `«I came to the course with zero knowledge of crypto. The training is thorough, with repetition of every topic and answers to every question. Three months in, I'm already opening my own trades and making a profit. The community and Lyosha's own trades help a lot.»`
    },
    "testimonial.gunzi": {
      ru: `«С самого начала Лёха выделялся — писал чётко, по делу, без воды. Сначала просто тестировал его идеи, и они начали приносить результат — тогда решился на обучение. До этого знания о рынке были полным хаосом, а теперь всё разложено по полочкам.»`,
      en: `«From the start, Lyokha stood out — he wrote clearly and to the point, no fluff. At first I just tested his ideas, and they started producing results — that's when I decided to take the course. Before that, my market knowledge was total chaos; now everything is laid out clearly.»`
    },
    "testimonial.ksyusha": {
      ru: `«Я кайфую от обучения. Обстановка комфортная, информация воспринимается легко. Нравится, что всегда возвращаемся к повторению предыдущих тем — новый материал прогоняем не один раз, это реально помогает. Ещё супер мотивирует хороший фидбэк по домашкам.»`,
      en: `«I'm loving the course. The atmosphere is comfortable, and the material is easy to absorb. I like that we always go back and repeat earlier topics — we go over new material more than once, and it really helps. Good feedback on homework is also super motivating.»`
    },

    /* -------------------------------------------------------------- contact */
    "contact.eyebrow": { ru: `<span></span> Контакты`, en: `<span></span> Contact` },
    "contact.title": { ru: `Как связаться<br><em>с нами?</em>`, en: `How to<br><em>reach us?</em>` },
    "contact.lead": {
      ru: `По вопросам сотрудничества, партнёрства и деловым предложениям напишите команде CRYPTO INFO | TRADING.`,
      en: `For collaboration, partnership, or business inquiries, contact the CRYPTO INFO | TRADING team.`
    },
    "contact.label": { ru: `Электронная почта`, en: `Email` },
    "contact.cta": {
      ru: `Написать на почту <span class="mail-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="5" width="19" height="14" rx="3" stroke="currentColor" stroke-width="2"/><path d="M4 7.5L12 13.5L20 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`,
      en: `Email us <span class="mail-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="5" width="19" height="14" rx="3" stroke="currentColor" stroke-width="2"/><path d="M4 7.5L12 13.5L20 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
    },

    /* ------------------------------------------------------------ final CTA */
    "cta.title": {
      ru: `Рынок меняется быстро.<br><em>Логика остаётся.</em>`,
      en: `The market changes fast.<br><em>The logic stays.</em>`
    },
    "cta.button": {
      ru: `Перейти в Telegram <span aria-hidden="true">↗︎</span>`,
      en: `Go to Telegram <span aria-hidden="true">↗︎</span>`
    },

    /* -------------------------------------------------------------- footer */
    "footer.disclaimer": {
      ru: `Материалы носят информационный характер и не являются индивидуальной инвестиционной рекомендацией.`,
      en: `The materials are for informational purposes only and do not constitute individual investment advice.`
    },

    /* ====================================================================
       CABINET (cabinet-4d70bc8a.html)
       ==================================================================== */
    "cabinet.meta.title": {
      ru: `Материалы курса — CRYPTO INFO | TRADING`,
      en: `Course Materials — CRYPTO INFO | TRADING`
    },
    "cabinet.meta.description": {
      ru: `Личный кабинет ученика CRYPTO INFO | TRADING — видеоуроки программы TRADER с 0 до PRO 3.0.`,
      en: `CRYPTO INFO | TRADING student portal — video lessons for the TRADER с 0 до PRO 3.0 program.`
    },
    "cabinet.header.label": { ru: `Личный кабинет ученика`, en: `Student Portal` },
    "cabinet.header.chatButton": {
      ru: `Закрытый чат «TRADER с 0 до PRO 3.0» <span aria-hidden="true">↗︎</span>`,
      en: `Private chat «TRADER с 0 до PRO 3.0» <span aria-hidden="true">↗︎</span>`
    },
    "cabinet.hero.eyebrow": { ru: `<span></span> Видеоматериалы обучения`, en: `<span></span> Course Video Materials` },
    "cabinet.hero.lead": {
      ru: `Все видеоуроки программы — в одном месте. Смотрите в удобном для себя темпе, отмечайте пройденное и возвращайтесь в любой момент — доступ сохраняется за вами.`,
      en: `All the program's video lessons in one place. Watch at your own pace, mark what you've completed, and come back anytime — your access stays with you.`
    },
    "cabinet.progressAria": { ru: `Прогресс прохождения курса`, en: `Course progress` },
    "cabinet.progressTemplate": {
      ru: `{done} из {total} уроков пройдено`,
      en: `{done} of {total} lessons completed`
    },
    "cabinet.sidebar.label": { ru: `Программа курса`, en: `Course Program` },
    "cabinet.sidebar.meta": { ru: `5 модулей · 55 уроков`, en: `5 modules · 55 lessons` },
    "cabinet.sidebar.closeAria": { ru: `Закрыть меню`, en: `Close menu` },
    "cabinet.video.placeholder": {
      ru: `Видео появится здесь после загрузки`,
      en: `Video will appear here once uploaded`
    },
    "cabinet.lesson.titleDefault": { ru: `Выберите урок`, en: `Select a lesson` },
    "cabinet.lesson.markWatched": { ru: `Отметить как просмотренный`, en: `Mark as watched` },
    "cabinet.lesson.watched": { ru: `Урок просмотрен ✓`, en: `Lesson watched ✓` },
    "cabinet.lesson.descPlaceholder": {
      ru: `Описание урока появится здесь после наполнения программы.`,
      en: `The lesson description will appear here once the program is filled in.`
    },
    "cabinet.nav.prevAria": { ru: `Предыдущий урок`, en: `Previous lesson` },
    "cabinet.nav.nextAria": { ru: `Следующий урок`, en: `Next lesson` },
    "cabinet.materials.label": { ru: `Материалы урока`, en: `Lesson materials` },
    "cabinet.support.label": { ru: `Нужна помощь?`, en: `Need help?` },
    "cabinet.support.desc": {
      ru: `Куратор на связи в закрытом чате — если что-то не понятно по уроку или есть вопрос по домашнему заданию, пишите в любое время.`,
      en: `Your mentor is available in the private chat — if anything about the lesson is unclear or you have a question about homework, write anytime.`
    },
    "cabinet.footer.disclaimer": {
      ru: `Доступ к материалам предоставляется лично вам. Пожалуйста, не передавайте ссылку третьим лицам.`,
      en: `Access to these materials is granted to you personally. Please don't share the link with third parties.`
    }
  };

  /* ---------------------------------------------------------------------
     Storage helpers — never let a blocked/absent localStorage break the page
     --------------------------------------------------------------------- */
  function getSavedLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "ru" || saved === "en") return saved;
    } catch (e) {
      /* localStorage unavailable — fall through to default */
    }
    return DEFAULT_LANG;
  }

  function saveLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore — language just won't persist across visits */
    }
  }

  var currentLang = getSavedLang();

  /* ---------------------------------------------------------------------
     t(key, vars) — look up a translated string, optionally filling in
     {placeholders} with values from vars. Falls back to ru, then "".
     --------------------------------------------------------------------- */
  function t(key, vars) {
    var entry = TRANSLATIONS[key];
    if (!entry) return "";
    var str = entry[currentLang] || entry.ru || "";
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return str;
  }

  function updateToggleUi() {
    var buttons = document.querySelectorAll("[data-lang]");
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === currentLang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var entry = TRANSLATIONS[key];
      if (!entry) return;
      el.innerHTML = entry[currentLang] || entry.ru || el.innerHTML;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var entry = TRANSLATIONS[key];
      if (entry) el.setAttribute("placeholder", entry[currentLang] || entry.ru);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var entry = TRANSLATIONS[key];
      if (entry) el.setAttribute("aria-label", entry[currentLang] || entry.ru);
    });

    var pageMetaTitleKey = document.documentElement.getAttribute("data-i18n-title");
    if (pageMetaTitleKey && TRANSLATIONS[pageMetaTitleKey]) {
      document.title = TRANSLATIONS[pageMetaTitleKey][currentLang] || document.title;
    }
    var pageMetaDescKey = document.documentElement.getAttribute("data-i18n-meta-description");
    if (pageMetaDescKey && TRANSLATIONS[pageMetaDescKey]) {
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", TRANSLATIONS[pageMetaDescKey][currentLang] || metaDesc.getAttribute("content"));
    }

    updateToggleUi();

    document.dispatchEvent(new CustomEvent("cit:langchange", { detail: { lang: currentLang } }));
  }

  function setLang(lang) {
    if (lang !== "ru" && lang !== "en") return;
    if (lang === currentLang) return;
    currentLang = lang;
    saveLang(lang);
    applyTranslations();
  }

  function wireToggle() {
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  window.CIT_I18N = {
    t: t,
    getLang: function () { return currentLang; },
    setLang: setLang
  };

  wireToggle();
  applyTranslations();
})();
