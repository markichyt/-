// Polski katalog (WERSJA ROBOCZA — do korekty przez native speakera, zwłaszcza terminy prawne).
// Struktura kluczy taka sama jak uk/en. Ceny/progi w zł — szkic, do zatwierdzenia.
export default {
  meta: {
    title: 'ConsultantLM — Czy Twoja kancelaria jest gotowa?'
  },
  common: {
    next: 'Dalej →',
    skip: 'Pomiń',
    selectOneOrMore: 'Wybierz jedną lub więcej',
    chosen: 'wybrano',
    discountBanner: 'ZNIŻKA 20% TYLKO DLA CIEBIE!',
    timer: { hours: 'godz', minutes: 'min', seconds: 'sek' }
  },
  topbar: {
    step: 'KROK {n} / {total}'
  },
  validation: {
    required: 'Wypełnij to pole',
    file: 'Dodaj plik',
    emailInvalid: 'Nieprawidłowy format e-mail',
    phoneInvalid: 'Nieprawidłowy numer telefonu',
    passwordRepeat: 'Powtórz hasło',
    passwordMismatch: 'Hasła nie są zgodne',
    passwordWeak: 'Min 5 znaków, wielka litera i cyfra'
  },
  slides: {
    quickContact: {
      q: 'Poznajmy się <span class="accent">bliżej</span>',
      sub: 'Krótkie wprowadzenie, zanim ułożymy Twój profil',
      fields: {
        first_name: { label: 'Imię', ph: 'Jan' },
        last_name: { label: 'Nazwisko', ph: 'Kowalski' },
        email: { label: 'E-mail', ph: 'jan@example.com' },
        phone: { label: 'Telefon', ph: '+48 500 123 456' },
        password: { label: 'Hasło', ph: 'Min 5 znaków, wielkie litery + cyfra' },
        password_confirm: { label: 'Potwierdź hasło', ph: 'Powtórz hasło' }
      }
    },
    photoUpload: {
      q: 'Prześlij <span class="accent">swoje zdjęcie!</span>',
      sub: 'Prześlij zdjęcie, aby wygenerować awatar wideo do Twojego profilu'
    },
    profession: {
      q: 'Co najlepiej opisuje Twój <span class="accent">zawód?</span>',
      sub: 'Wybierz obszar swojej działalności',
      opt: {
        advocate: 'Adwokat',
        legal_counsel: 'Radca prawny',
        notary: 'Notariusz',
        patent_agent: 'Rzecznik patentowy',
        tax_advisor: 'Doradca podatkowy',
        accountant: 'Księgowy',
        other: 'Inne'
      }
    },
    city: {
      q: 'Twoje <span class="accent">miasto pracy?</span>',
      sub: 'Wybierz z listy lub wpisz dowolne miasto',
      placeholder: 'Zacznij wpisywać nazwę miasta',
      noMatch: 'Brak dopasowań — kliknij „Dalej", aby użyć wpisanego.'
    },
    role: {
      q: 'Co najlepiej opisuje Twoją <span class="accent">rolę?</span>',
      sub: 'Pomóż nam spersonalizować Twoje doświadczenie',
      opt: {
        self_employed: 'Samozatrudniony / prowadzę własną działalność',
        employee: 'Pracownik (w firmie)',
        executive: 'Kierownik / menedżer',
        founder: 'Założyciel / właściciel firmy'
      }
    },
    services: {
      q: 'Jakie usługi <span class="accent">świadczysz?</span>',
      sub: 'Wybierz wszystkie pasujące',
      opt: {
        social_integration: 'Prawo świadczeń społecznych i integracji',
        digital_id: 'Identyfikacja cyfrowa i usługi e-administracji',
        tax_zus: 'Prawo podatkowe, ZUS i finanse',
        ip: 'Prawo własności intelektualnej',
        notarial: 'Usługi notarialne',
        accounting: 'Doradztwo księgowe i podatkowe',
        sworn_translation: 'Tłumaczenia przysięgłe i prawne',
        social_benefits: 'Prawo świadczeń socjalnych',
        education: 'Prawo edukacyjne i studenckie',
        social_insurance: 'Prawo ubezpieczeń społecznych',
        residence: 'Legalizacja pobytu i prawo pobytowe',
        compensation: 'Odszkodowania i dochodzenie roszczeń',
        real_estate: 'Prawo nieruchomości',
        inheritance: 'Prawo spadkowe',
        criminal: 'Prawo karne',
        tax_advisory: 'Doradztwo podatkowe',
        transport: 'Prawo transportowe i drogowe',
        labour: 'Prawo pracy',
        investment: 'Prawo inwestycyjne i dotacje',
        family: 'Prawo rodzinne i opiekuńcze',
        corporate: 'Prawo gospodarcze i handlowe',
        migration: 'Prawo migracyjne i legalizacja pobytu',
        other: 'Pozostałe usługi prawne'
      }
    },
    channels: {
      q: 'Gdzie jest Twoja firma <span class="accent">obecna?</span>',
      sub: 'Wybierz wszystkie opcje',
      opt: {
        telegram: 'Telegram',
        instagram: 'Instagram lub Facebook',
        tiktok: 'TikTok',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        twitter: 'X (Twitter)',
        website: 'Własna strona',
        other_channel: 'Inne'
      }
    },
    preferred_way: {
      q: 'Jak najchętniej pozyskujesz <span class="accent">więcej klientów?</span>',
      sub: 'Jak chcesz się rozwijać',
      opt: {
        social_media: 'Media społecznościowe',
        paid_ads: 'Płatne reklamy',
        both: 'Jedno i drugie',
        ai_decide: 'Brak planu — niech zdecyduje AI'
      },
      disclaimer: {
        social_media: 'Automatyzacja: pomagamy tworzyć i prowadzić media społecznościowe automatycznie — treści budujące zaufanie i przyciągające klientów.',
        paid_ads: 'Nasze reklamy AI to wzmacniacz: ulepszamy to, co już robisz.',
        both: 'Świetny wybór! Połączymy podejście płatne i organiczne dla maksymalnych efektów.',
        ai_decide: 'Ufasz nam? Świetnie. AI dobierze najlepszą strategię dla Twojej firmy i przyniesie efekty.'
      }
    },
    marketing_time: {
      q: 'Ile godzin dziennie poświęcasz na <span class="accent">marketing?</span>',
      sub: 'Wliczając media społecznościowe, treści i blogi',
      opt: {
        none: 'Nie poświęcam czasu na marketing',
        less_1: 'Mniej niż 1 godzina',
        '1_5': '1–5 godzin',
        '5_plus': '5+ godzin'
      }
    },
    ad_budget: {
      q: 'Jaki jest Twój miesięczny <span class="accent">budżet reklamowy?</span>',
      sub: 'Orientacyjnie',
      opt: {
        none: 'Nie wydaję',
        to_40k: 'Do 4 000 zł',
        to_400k: '4 000 – 20 000 zł',
        over_400k: 'Ponad 20 000 zł'
      }
    },
    team: {
      q: 'Kto jest w Twoim <span class="accent">zespole marketingowym?</span>',
      sub: 'Wybierz wszystkie role, które zatrudniasz',
      opt: {
        seo: 'Specjalista SEO / researcher treści',
        scriptwriter: 'Scenarzysta',
        videographer: 'Operator',
        video_editor: 'Montażysta',
        smm: 'Specjalista reklamy / SMM',
        crm_manager: 'CRM / menedżer zapytań',
        no_team: 'Nie mam zespołu'
      }
    },
    aiCalc: {
      q: 'Twój potencjał z <span class="accent">AI</span>',
      sub: 'Na podstawie Twoich obszarów praktyki i rynku nasze AI obliczyło, ilu nowych klientów i ile przychodu możesz uzyskać miesięcznie — i ile kosztowałoby to bez nas.'
    },
    assessment: {
      q: 'Jak gotowy jest Twój <span class="accent">profil</span>',
      sub: 'Oceniliśmy Twoje odpowiedzi — im pełniejszy profil, tym wyższa ocena i większe zaufanie klientów na ConsultantLM.'
    },
    fullProfile: {
      q: 'Uzupełnij swój <span class="accent">profil</span>',
      sub: 'Wybierz jedno — napisz szczegółowe bio (3 000+ znaków) lub prześlij CV. Resztę wygeneruje nasze AI.'
    },
    profilesPricing: { q: 'Wybierz swój <span class="accent">plan</span>', sub: '' },
    payment: { q: 'Dokończ <span class="accent">zakup</span>', sub: '' }
  },
  pricing: {
    perMonthShort: '/mies.',
    note: {
      monthly: 'miesięcznie, płatność co miesiąc',
      annual: 'miesięcznie, płatność roczna (–10%)'
    },
    features: {
      ai_pro_avatar: 'Awatar AI PRO',
      ai_premium_avatar: 'Awatar AI PREMIUM',
      posts_10: '10 postów/wideo AI',
      posts_40: '40 postów/wideo AI',
      posts_100: '100 postów/wideo AI',
      leads_6: '6 zakupów leadów',
      leads_30: '30 zakupów leadów',
      leads_unlim: 'Nielimitowane zakupy leadów',
      reputation_10: 'Do 10 sprawdzeń reputacji',
      reputation_unlim: 'Nielimitowane sprawdzenia reputacji',
      google_top: 'Topowa pozycja w Google na Twoje nazwisko',
      manager_24_7: 'Osobisty menedżer 24/7',
      exclusive_smm: 'Ekskluzywna promocja w social media',
      rating_boost: 'Wzrost oceny na podstawie doświadczenia',
      own_prices: 'Własne ceny za Twoje usługi',
      ai_module: 'Moduł AI dla Google i Meta',
      ai_monitoring: 'Monitoring konkurencji AI',
      ai_assistant: 'Asystent klienta AI',
      referral: 'Zarobek partnerski',
      private_chat: 'Prywatny czat specjalistów',
      crm: 'System CRM',
      messenger: 'Bezpieczny komunikator',
      ai_avatar: 'Awatar AI',
      reputation: 'Sprawdzenia reputacji'
    },
    badges: {
      new: 'NOWOŚĆ',
      more_4x: '4x więcej',
      more_5x: '5x więcej',
      more_2_5x: '2.5x więcej',
      infinity: '∞',
      upgrade: 'UPGRADE'
    }
  },
  cards: {
    photo: {
      dropHint: 'Kliknij, aby przesłać zdjęcie',
      error: {
        badType: 'Nieprawidłowy format — tylko JPEG / PNG',
        tooBig: 'Plik za duży — maksymalnie 5 MB'
      },
      dropSub: 'JPEG lub PNG · do 5 MB · poziome 16:9',
      previewAlt: 'Podgląd zdjęcia',
      warnRatio: '⚠ Zdjęcie nie jest poziome 16:9 — wideo może wyglądać nieprawidłowo',
      uploadOwn: 'Prześlij swoje zdjęcie',
      samplesTitle: 'Nie masz zdjęcia pod ręką? Wybierz przykład 👇',
      sampleLabel: 'Przykład',
      modalUploadOther: 'Prześlij inne zdjęcie',
      modalProceed: 'Kontynuuj',
      errors: {
        WRONG_RATIO: {
          title: 'Nieprawidłowy format zdjęcia',
          body: 'Załączono zdjęcie w formacie niepoziomym (nie 16:9). Z tego powodu <strong class="pu-modal-danger">wideo może wyglądać nieprawidłowo</strong>.'
        },
        NO_PERSON: {
          title: 'Nie znaleziono osoby',
          body: 'Nie znaleziono osoby na zdjęciu. Prześlij swoje <strong class="pu-modal-danger">zdjęcie portretowe</strong>.'
        },
        MULTIPLE_PEOPLE: {
          title: 'Więcej niż jedna osoba',
          body: 'Na zdjęciu jest więcej niż jedna osoba. Potrzebujemy zdjęcia <strong class="pu-modal-danger">tylko z Tobą</strong>.'
        },
        FACE_NOT_VISIBLE: {
          title: 'Twarz niewidoczna',
          body: 'Twarz nie jest widoczna. Potrzebujemy zdjęcia, na którym <strong class="pu-modal-danger">Twoja twarz jest dobrze widoczna</strong>.'
        }
      }
    },
    aiPotential: {
      heroEyebrow: 'Z nami otrzymujesz',
      heroCapHtml: 'potencjalnych klientów<br>miesięcznie',
      revenue: '≈ {low} – {high} zł',
      revenueCaption: 'przychodu / mies.',
      channels: {
        seo: 'SEO {min}–{max}',
        ads: 'Reklamy {min}–{max}',
        social: 'Social {min}–{max}'
      },
      compareQ: 'Aby uzyskać taki strumień samodzielnie — potrzebujesz <b>całego zespołu:</b>',
      teamRoleCost: '{low}–{high} tys. zł',
      teamRoles: {
        seo: 'Specjalista SEO',
        targeting: 'Specjalista reklamy',
        content: 'Twórca treści',
        video: 'Montażysta',
        smm: 'Menedżer SMM'
      },
      teamTotalLabel: 'Razem własny zespół',
      teamTotal: '{low}–{high} zł/mies.',
      usLabel: 'ConsultantLM — wszystko w jednym',
      ourPlan: '{amount} zł/mies.',
      punchHtml: '<b>{times}×</b> taniej — oszczędność do <b>{save} zł/mies.</b>',
      howTitle: 'Co obejmuje subskrypcja',
      how: {
        marketing: { t: 'Marketing pod klucz', d: 'Promujemy Cię w Google, reklamach i social media' },
        content: { t: 'Fabryka treści', d: 'Regularne treści na stronę, reklamy i markę' },
        leads: { t: 'Gotowe leady', d: 'Wysokiej jakości zapytania klientów w Twoich obszarach' },
        clients: { t: 'Klienci platformy', d: 'Osoby już szukające prawnika na ConsultantLM' }
      },
      finePrintLabel: 'Obliczono dla:',
      finePrintDisclaimer: 'Tylko szacunek — rzeczywisty wynik zależy od rynku, optymalizacji profilu i własnego wysiłku. Nie stanowi gwarancji dochodu.',
      professionFallback: 'Specjalista',
      serviceFallback: 'Ogólne',
      roleShort: {
        self_employed: 'Samozatrudniony',
        employee: 'Pracownik',
        executive: 'Kierownik',
        founder: 'Założyciel'
      }
    },
    assessment: {
      levels: { low: 'Niski', normal: 'Normalny', mid: 'Umiarkowany', high: 'Wysoki' },
      yourLevel: 'Twój poziom:',
      calculatedFor: 'Obliczono dla:',
      factors: 'Czynniki: budżet reklamowy{adBudget}, okres współpracy{period}, cele.',
      disclaimer: 'Tylko szacunek — rzeczywisty wynik może się różnić. Nie stanowi gwarancji dochodu.',
      professionFallback: 'Specjalista',
      serviceFallback: 'Ogólne',
      adBudget: {
        none: 'nie wydaję',
        to_40k: 'do 4 000 zł',
        to_400k: '4 000–20 000 zł',
        over_400k: 'ponad 20 000 zł'
      },
      period: { '1_month': '1 miesiąc', '1_year': '1 rok', '3_years': '3 lata' }
    },
    fullProfile: {
      finish: 'Zakończ →',
      strengthLabel: 'Siła profilu',
      strengthHint: {
        high: '✓ Silny profil — AI da świetne efekty',
        mid: 'Dobry początek — dodaj więcej szczegółów dla lepszej jakości AI',
        low: 'Dodaj szczegóły poniżej — im więcej informacji, tym silniejszy profil AI'
      },
      aboutLabel: 'O sobie',
      aboutHint: 'zalecane 3 000+ znaków',
      aboutPh: 'Opowiedz o swoim doświadczeniu, wykształceniu, osiągnięciach, znanych sprawach, certyfikatach, nagrodach…',
      cvCtaTitle: '📄 Masz CV? Prześlij je — zwiększa siłę profilu o 30%',
      cvCtaBody: 'Nasze AI wygeneruje Twój publiczny profil <strong>prosto z Twojego CV</strong>. Doświadczenie, wykształcenie, certyfikaty, znane sprawy i osiągnięcia są wyodrębniane automatycznie. <em>Opcjonalne, ale bardzo zalecane.</em>',
      cvLabel: 'Prześlij CV',
      cvHint: 'opcjonalnie · .pdf / .doc / .docx',
      cvPlaceholder: 'Kliknij, aby wybrać .pdf / .doc / .docx',
      logoLabel: 'Logo firmy',
      logoHint: 'opcjonalnie · PNG / JPG / SVG',
      logoPlaceholder: 'Kliknij, aby wybrać obraz',
      referralLabel: 'Kod polecający',
      optional: 'opcjonalnie',
      referralPh: 'Wpisz kod polecający',
      skipModal: {
        title: 'Zaczekaj — Twój profil będzie zbyt słaby',
        body: 'Bez <strong>bio</strong> lub <strong>CV</strong> nasze AI nie zbuduje konkurencyjnego profilu. Prawnicy, którzy pomijają ten krok, otrzymują <strong>znacznie mniej zapytań od klientów</strong> na ConsultantLM.<br><br>To zajmie 2 minuty i znacząco poprawi Twoje wyniki.',
        back: '← Wróć i uzupełnij',
        confirm: 'Pomiń mimo to'
      }
    },
    profilesPricing: {
      prevPlan: 'Poprzedni plan',
      nextPlan: 'Następny plan',
      plans: { base: 'BASE (Podstawowy)', pro: 'PRO', premium: 'PREMIUM' },
      cta: { base: 'Wybierz Base', pro: 'Wybierz Pro', premium: 'Wybierz Premium' },
      demo: { name: 'Jan Kowalski', role: 'Adwokat', location: 'Polska, Warszawa' },
      demoPremium: { name: 'Alexander König', role: 'Adwokat', location: 'Polska, Warszawa' },
      avatarAlt: 'Adwokat',
      avatarLabel: 'Podgląd awatara AI',
      avatarTagline: 'Twój awatar AI tworzy profesjonalne wideo w Twoim imieniu na stronę i social media',
      monthly: 'Miesięcznie',
      annual: 'Rocznie',
      saveBadge: '−10%',
      trustTitle: 'Stworzone dla polskich prawników',
      trustEthicsHtml: 'Zgodne z <strong>zasadami etyki adwokackiej</strong>',
      trustDataHtml: '<strong>Ochrona danych</strong> · SOC 2',
      customQuote: 'Duża kancelaria? Indywidualna oferta',
      close: 'Zamknij',
      lead: {
        title: 'Rejestracja zespołu',
        sub: 'Opowiedz o swojej kancelarii — menedżer skontaktuje się w ciągu 24 godzin z indywidualnym planem.',
        note: 'Ten plan jest dla zespołów od 10 specjalistów. Dla mniejszych — wybierz Base, Pro lub Premium.',
        firmName: 'Nazwa kancelarii',
        companyName: 'Nazwa firmy',
        teamSize: 'Wielkość zespołu',
        teamSizeHint: '(minimum 10)',
        teamSizePh: 'np. 12',
        location: 'Miasto',
        email: 'E-mail kontaktowy',
        phone: 'Telefon',
        message: 'Czego potrzebujesz?',
        messagePh: 'Zakres, integracje, white-label, terminy…',
        submit: 'Zamów rozmowę',
        sending: 'Wysyłanie…',
        foot: 'Wysyłając, zgadzasz się, że nasz zespół może się z Tobą skontaktować.',
        thanksTitle: 'Dziękujemy!',
        thanksSub: 'Menedżer skontaktuje się w ciągu 24 godzin z indywidualnym planem dla Twojego zespołu.'
      }
    },
    payment: {
      periods: { '1_month': '1 miesiąc', '1_year': '1 rok' },
      saveBadge: '-10%',
      savedHero: 'WŁAŚNIE ZAOSZCZĘDZIŁEŚ',
      rows: {
        plan: 'Plan {plan} — {period}',
        urgency: 'Zniżka za pośpiech (20%)',
        referral: 'Kod polecający (10%)',
        periodDiscount: 'Zniżka {period} ({pct}%)',
        total: 'Razem'
      },
      paypal: 'Zapłać przez PayPal',
      card: 'Zapłać kartą',
      sending: 'Wysyłanie…',
      faqHeading: 'Najczęstsze pytania',
      faq: {
        clients: {
          q: 'Ilu klientów mogę pozyskać miesięcznie?',
          a: 'W zależności od specjalizacji, miasta i optymalizacji profilu — wielu prawników pozyskuje 5–15 klientów już w pierwszym miesiącu, z czasem skalując do 20–30+ dzięki treściom AI i pozycjonowaniu SEO.'
        },
        guarantee: {
          q: 'Czy to gwarantowana liczba klientów?',
          a: 'Dostarczamy Ci leady, z którymi pracujesz samodzielnie. Możesz też pracować na wyłącznych warunkach z klientami platformy — wtedy są to już opłaceni klienci.'
        },
        payment: {
          q: 'Jak działa płatność?',
          a: 'Mamy trzy plany: Base, Pro i Premium. Koszt jest znacznie niższy niż tradycyjnych agencji marketingowych. Wielu prawników zwraca subskrypcję już 1–2 klientami.'
        },
        noClients: {
          q: 'A jeśli nie będzie klientów?',
          a: 'Dostępność leadów zależy od Twojej aktywności na platformie. Gwarantujemy nieprzerwany dostęp do platformy i jej zasobów. Płatność nie podlega zwrotowi po udzieleniu dostępu.'
        },
        data: {
          q: 'Czy moje dane są bezpieczne?',
          a: 'Tak, używamy bezpiecznego komunikatora, szyfrowania danych i nie przekazujemy informacji osobom trzecim. Platforma spełnia wymogi ochrony danych (RODO).'
        }
      },
      alertSuccess: 'Dziękujemy! Twoje zgłoszenie zostało przyjęte.',
      alertError: 'Błąd wysyłania (status {status}). Spróbuj ponownie.'
    }
  },
  scenes: {
    social: {
      count: '2 500+',
      countLabel: 'prawników',
      headline: 'zwiększyło swój dochód z nami',
      sub: 'Potwierdzony miesięczny dochód · 2024–2026',
      stats: {
        growthNum: '+183%', growthCap: 'śr. wzrost dochodu',
        renewNum: '94%', renewCap: 'przedłuża subskrypcję',
        countriesNum: '5', countriesCap: 'krajów'
      }
    },
    google: {
      query: 'Adwokat rozwodowy Warszawa',
      headlineHtml: 'Tak będzie wyglądać <span class="accent">Twój profil</span>',
      sub: '#1 w Google — wyżej niż LinkedIn i własna strona',
      result1Title: 'Jan Kowalski, Adwokat — Warszawa',
      result2Title: 'Jan Kowalski — Profil LinkedIn',
      result3Title: 'Kancelaria Kowalski — Strona główna',
      views: 'Wyświetlenia', leads: 'Zapytania', revenue: 'Dochód',
      chartTitle: 'Wyświetlenia profilu — ostatnie 6 miesięcy',
      chartBadge: '↗ Rekord',
      months: { m0: 'Lis', m1: 'Gru', m2: 'Sty', m3: 'Lut', m4: 'Mar', m5: 'Kwi' }
    },
    ads: {
      headlineHtml: 'Zamień swoją praktykę w <span class="accent">strumień klientów</span> z reklamą AI',
      sub: 'Generuj wideo i publikuj — samo przyciąga nowych klientów.',
      demoName: 'Jan Kowalski',
      demoRole: 'ADWOKAT · WARSZAWA',
      resultsTitle: 'Ostatnie 30 dni',
      roi: '+340% ROI',
      newClients: 'Nowi klienci',
      revenue: 'Dochód',
      liveNow: 'Kampania AI na żywo',
      volume: '14 reklam · 6 kanałów'
    },
    content: {
      headlineHtml: 'Obserwuj konkurencję <span class="accent">24/7</span>',
      sub: 'i twórz lepsze treści w kilka minut z ConsultantLM.',
      steps: { scan: 'Skan', generate: 'Generacja', publish: 'Publikacja', analyze: 'Analiza', scale: 'Skala' },
      before: 'Przed', after: 'Po',
      competitor: 'Konkurent', yours: 'Twoja treść',
      views: 'Wyświetlenia', engagement: 'Zaangażowanie',
      badge: '+1,458%',
      totalLabel: 'Całkowity zasięg',
      totalFoot: 'na 5 platformach · na kampanię'
    }
  }
}
