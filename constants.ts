

import { MenuItem, SectionData, Work, UpcomingEvent } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { label: "Home", href: "/#hero", view: 'home' },
  { label: "Compositions", href: "/compositions", view: 'works' },
  { label: "Upcomings", href: "/upcomings", view: 'upcomings' },
  { label: "About", href: "/about", view: 'about' }
];

export const SECTIONS: SectionData[] = [
  {
    id: 'hero',
    title: 'Home',
    subtitle: 'Back to start',
    imageUrl: '/photos/Hero2.jpg',
    type: 'image-bottom',
    theme: 'dark'
  },
  {
    id: 'works-preview',
    title: 'Compositions',
    subtitle: 'Browse my compositions',
    imageUrl: '/photos/compositions.jpg',
    mobileImageUrl: '/photos/compositions.jpg',
    type: 'image-bottom',
    theme: 'light'
  },
  {
    id: 'upcomings-preview',
    title: 'Upcomings',
    subtitle: 'Future works and events',
    imageUrl: '/photos/upcoming.jpg',
    mobileImageUrl: '/photos/upcoming.jpg',
    type: 'image-top',
    theme: 'light'
  },
  // Video Section is inserted here in App.tsx layout
  {
    id: 'about',
    title: 'About',
    subtitle: 'Biography, Resumé',
    imageUrl: '/photos/about.jpg',
    mobileImageUrl: '/photos/about.jpg',
    type: 'image-bottom',
    theme: 'light'
  }
];

export const WORKS: Work[] = [
  // NOTE FOR NEXT CODER:
  // In the `performer` field, any text enclosed in parentheses (e.g., "(piano)") 
  // will be rendered without the parentheses and with a light, italic font.
  // Example: "Max GRIMM (piano)" will render as "Max GRIMM piano" (where piano is light and italic).
  {
    id: 'tastaturlust',
    title: 'Tastaturlust',
    categories: ['Featured', 'Solo'],
    year: '2025',
    instrumentation: 'piano',
    duration: '7 mins',
    premiere: {
      date: '14 MAY 2025',
      occasion: 'Musik & Gegenwart 112',
      venue: 'Probesaal, HMT Leipzig, Grassistraße 8',
      location: 'Leipzig, Germany',
      ticketUrl: 'https://www.hmt-leipzig.de/en/up-to-date/news-detail/konzert-musik-gegenwart-109-neue-kompositionen-von-studierenden',
      performer: 'Max GRIMM (piano)',
      mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
    },
    programmeNotes: 'The "Taste" (Ger: key/ button) mechanisms of the piano are explored as sonic material, reducing the music almost entirely to a percussive piece. This opens up space for listeners to focus on the piece’s flow and to engage with its material units.',
    otherPerformances: [
        {
            date: '22 JUL 2025',
            occasion: 'Darmstädter Ferienkurse',
            venue: 'Akademie für Tonkunst',
            location: 'Darmstadt, Germany',
            performer: 'Max GRIMM (piano)',
            mapUrl: 'https://maps.app.goo.gl/6UTzDGyJfUNPwc4y7',
        },
        {
            date: '05 SEP 2025',
            occasion: 'Cage Award',
            venue: 'Cage-Haus, Am Kloster 1',
            location: 'Halberstadt, Germany',
            performer: 'Max GRIMM (piano)',
            mapUrl: 'https://maps.app.goo.gl/rBnysrrgBPkqtAJDA'
        }
    ],
    listenUrl: 'https://youtu.be/FNYY_ofQXak?si=6p9aIG3SFCkSIRKA'
  },
  {
    id: 'excursion-ii',
    title: 'Excursion II',
    categories: ['Featured', 'Chamber'],
    year: '2023',
    remarks: 'Represented Hong Kong sector in The 70<sup>th</sup> International Rostrum of Composers (IRC) and Nominated as one of the 6 recommended works',
    instrumentation: 'Flute, Clarinet, Sheng (37-reed), Pipa, Piano, 2 Violins, Viola, Cello',
    duration: '6 mins 30 secs',
    premiere: {
      date: '27 OCT 2023',
      occasion: 'Transcending Music Legacy (Hong Kong Composers’ Guild 40<sup>th</sup> Anniversary Celebration)',
      venue: 'Theatre of Sheung Wan Civic Centre',
      location: 'Hong Kong',
      ticketUrl: 'https://www.hkcg.org/transcending-music-legacy',
      performer: 'Conductor: Angus LEE\nSze-wang LOO (sheng), Wai-lun PANG (pipa) & Nova Ensemble: Marco LEUNG (flute), Stephenie NG (clarinet), Joanne LI (piano), Sean LI (violin), Vanessa CHAN (violin), William LANE (viola), Chak-yin PUN (cello)',
      mapUrl: 'https://maps.app.goo.gl/DYpkvGH3ARM9dvMF7'
    },
    programmeNotes: `
    This composition was selected by the 70<sup>th</sup> International Rostrum of Composers (IRC) as one of the Recommended Works. It was originally commissioned by the Hong Kong Composers’ Guild (HKCG) in 2023 to commemorate its 40<sup>th</sup> anniversary, under the concert titled "Transcending Music Legacy". The composition originated from the original quintet named “Excursion” and was subsequently expanded for this nine-member ensemble. The piece uses octatonic scale and augmented chords as dialectical forces and transcends towards a somewhat tonal conclusion as a synthesis. It is an excursion experiencing the phenomenon of the inescapable cognitive association of tonality, regardless of how far music evolves. This inescapable fate resonates with the concept of “Tonality” as one of the pre-expressive qualities of every sound, articulated by the composer Helmut Lachenmann, who stated that one can immediately hear and create tonal connotation even in non-tonal settings. Many people grow up with tonality and habitually generate musical meanings with it, thus our listening is somehow conditioned by tradition, culture, and ideology.

    With the aim of letting the listener experience the inescapable fate of having tonal connotation when listening to sounds, besides having a tonal conclusion as mentioned, inspired by Lachenmann’s Accanto, I intentionally slip in a fragment of Mozart’s piano sonata during the obscured tonality, giving the moment a heightened tonal aura. At the same time, the piece continues by deconstructing, extracting, and re-contextualising the acoustic qualities of the sonata’s fragment as a way to open up the possibilities of the materials that were once supposed to be used only in tonal language.

    In commemorating the 40<sup>th</sup> anniversary of HKCG through this composition, the intention is not merely to celebrate the past but to transcend musical legacies (as the concert title suggests). By blending the Mozart with the contemporary, fusing Western with Chinese instruments, this piece invites the listeners and performers to contemplate and to participate in the ongoing evolution of musical meanings.  
`,
    listenUrl: 'https://youtu.be/lsXMEEnmyVk?si=vMbXfNpWLkZ53Vtd'
  },
  {
    id: 'then-he-wrapped-his-face-in-his-mantle',
    title: '...then, "he wrapped his face in his mantle"',
    categories: ['Large Ensemble'],
    year: '2026',
    instrumentation: 'Orchestra',
    duration: '7 mins',
    premiere: {
      date: '01 JUL 2026',
      occasion: 'Kompositionswerkstatt – Abschlusspräsentation',
      venue: 'MDR-Studio am Augustusplatz',
      location: 'Leipzig, Germany',
      performer: 'MDR-Sinfonieorchester, Michael WENDEBERG (conductor)',
      ticketUrl: 'https://www.mdr.de/konzerte/konzertkalender/konzert-3340.html',
      mapUrl: 'https://maps.app.goo.gl/7T2p2Y5VCDJKShC9A'
    },
    programmeNotes: `
      The piece is about the contrast between nuance and violence and anything in between, a re-imagined sound mass experienced by the prophet Elijah (1 Kings 19:11–12) before his action described in the title. These are two qualities that affect me most strongly on an intellectual and a physical level respectively. The orchestra provides an ideal apparatus for articulating the difference and the overlaps.

      For me, the nuanced character provides space for quietness, fragility, and patience, demanding “close listening” within the inherently subtle and constant shifts. Violence, on the other hand, exists in a substantial way that hits me directly with its immediacy and imposing a direct physical impact that acts on the ear as much as on the body.
`,    
    listenUrl: '#'
  },
  {
    id: 'flux',
    title: 'Flux',
    categories: ['Chamber'],
    year: '2026',
    instrumentation: 'Flute & Viola',
    duration: '5 mins',
    premiere: {
      date: '13 FEB 2026',
      occasion: 'Lucerne Academy for Contemporary Music',
      venue: 'Blackbox Kosmos, Lucerne University of Applied Sciences and Arts (HSLU)',
      location: 'Lucerne, Switzerland',
      ticketUrl: 'https://www.hslu.ch/de-ch/musik/studium/meisterkurse-und-workshops/meisterkurse-contemporary-music-studies/',
      performer: 'Dissolution Ensemble: Rebecca BLAU (flute), Sofia von ATZINGEN (viola)',
      mapUrl: 'https://maps.app.goo.gl/4xomZKWKZ2j86RWr5'
    },
    programmeNotes: `The music gives perpetual movement, change, and flow - nuanced and violent. It rejects staticity, hence the title «Flux».
`,    
    listenUrl: '#'
  },
  {
    id: 'Melt',
    title: 'Melt メルト (arr.)',
    categories: ['Large Ensemble'],
    year: '2026',
    instrumentation: 'Orchestra',
    duration: '4 mins 45 secs',
    premiere: {
      date: '18-19 MAR 2026',
      occasion: 'Vocaloid Essentials on Stage III',
      venue: 'Queen Elizabeth Stadium (Arena)',
      location: 'Hong Kong',
      performer: 'Hong Kong Doujin Philharmonia',
      ticketUrl: 'https://www.art-mate.net/doc/92018?name=Vocaloid+Essentials+on+Stage+III',
      mapUrl: 'https://maps.app.goo.gl/smGZeCPUmaeTiTYQA'
    },
    listenUrl: '#'
  },
  {
    id: 'sui-ergastulum',
    title: 'Sui Ergastulum',
    categories: ['Solo'],
    year: '2025',
    instrumentation: 'Contrabass Clarinet',
    duration: '6 mins 40 secs',
    premiere: {
      date: '22 OCT 2025',
      occasion: 'Konzert Next Generation #7',
      venue: 'Probesaal, HMT Leipzig, Grassistraße 8',
      location: 'Leipzig, Germany',
      ticketUrl: 'https://www.hmt-leipzig.de/news-events/konzert-next-generation-7',
      performer: 'Ensembles El Perro Andaluz: Albrecht Scharnweber (contrabass clarinet)',
      mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
    },
    programmeNotes: `I see so many confines themselves like a slave to some external conditions. May peace find a place in everyone's heart.
`,  
    otherPerformances: [
        {
            date: '23 OCT 2025',
            occasion: 'Förderpreiskonzert der Leipzigstiftung',
            venue: 'Konzertsaal, Hochschule für Musik Dresden',
            location: 'Dresden, Germany',
            ticketUrl: 'https://www.leipzigstiftung.de/de/entries/forderpreis-der-leipzigstiftung-geht-an-agustin-castellon-molina-leipzig-und-julius-von-lorentz/',
            performer: 'Ensembles El Perro Andaluz: Albrecht Scharnweber (contrabass clarinet)',
            mapUrl: 'https://maps.app.goo.gl/sd3uGy4c4n3N7YA89'
        },
    ],
    listenUrl: '#'
  },
  {
    id: 'time-tunnel-2',
    title: 'Time Tunnel 2',
    categories: ['Large Ensemble'],
    year: '2025',
    instrumentation: 'Wind Orchestra',
    duration: '5 mins 30 secs',
    premiere: {
      date: '09 SEP 2025',
      occasion: 'HKBDA Annual Concert 2025 - Satoshi Yagisawa X HKBDWO',
      venue: 'Hong Kong City Hall',
      location: 'Hong Kong',
      ticketUrl: 'https://www.art-mate.net/doc/86845?name=%E5%85%AB%E6%9C%A8%E6%BE%A4%E6%95%99%E5%8F%B8+X+%E9%A6%99%E6%B8%AF%E7%AE%A1%E6%A8%82%E5%8D%94%E6%9C%83%E5%B0%88%E6%A5%AD%E5%B0%8E%E5%B8%AB%E7%AE%A1%E6%A8%82%E5%9C%98',
      performer: 'Hong Kong Band Directors Wind Orchestra (HKBDWO), Samuel Hong-Yu LEUNG (conductor)',
      mapUrl: 'https://maps.app.goo.gl/gd1nDggeq3BsJFio7'
    },
    programmeNotes: `Time Tunnel 2 was written for the HKBDA 2025 Annual Concert. It takes us back to places that once made us feel excited. The Time Tunnel series explores the semantic possibilities of using fragmented and cut-off phrases as musical material.
`,   
    listenUrl: 'https://youtu.be/xsSvxqhZJtM'
  },
  {
    id: 'dialogue-x',
    title: 'Dialogue X',
    categories: ['Chamber'],
    year: '2025',
    instrumentation: 'Soprano, Harp, Cello',
    duration: '9 mins',
    premiere: {
      date: '09 SEP 2025',
      occasion: 'ZfGM Festival 2025',
      venue: 'Probesaal HMT Leipzig, Grassistraße 8',
      location: 'Leipzig , Germany',
      ticketUrl: 'https://www.hmt-leipzig.de/news-events/zfgm-festival-2025-konzert',
      performer: 'Frauke AULBERT (soprano), Caroline HOLLER (harp), Yutong WEI (cello)',
      mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
    },
    programmeNotes: `The title suggests that the instrumentalists, as distinctive voices, attempts to have a dialogue. The "X" carries two meanings: first, it represents a cross, symbolizing the intersection of voices and sections defined by different emotions — both across time (horizontally) and in the moment (vertical, timbral); second, it signifies an error, obstruction, or something simply wrong.
`,   
    listenUrl: '#'
  },
  {
    id: 'rabbit-hole',
    title: 'Rabbit Hole',
    categories: ['Solo', 'With Electronics/ Installations'],
    year: '2023',
    instrumentation: 'Erhu, Live Electronics',
    duration: '8 mins 50 secs',
    premiere: {
      date: '18 AUG 2023',
      occasion: 'Chinese Instruments X Electroacoustic Music',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Justin Ching-yin WONG (erhu)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    programmeNotes: `Ohh, erm… oh no!!! nOO!! NOOOOO!!! That's… are they? Ho-w? Huh??? How? NOOOOOO, erm…, ehhhh… Yes!!! That's it!!!!!! YessssSSSS! Yeahhhhhhhh!!!!!! Am I? Really? How…do…I…, huh??? What?????? NOOOOOOO!!!!! Oh NO NO NO NO NO NO NOOOOOooooooooooooOOOO!!! Not THAT!!! AHHHHHHHHHHHHHHHHHHHH!!!!!!!!!!!!! Really! Could… real l y… are? Them! No. Yes! NO! NOOOOO! But how………. WHAT? YOU? YOU! YOU!!!! Not you, no, no no, NOT YOU. I knew that! Do I? Erm… How do…I? Just How?? Yes? Erm… oh no!!! No…… I think not. Yes. NO! Not no… NO! NO! No-t… NOT! Not that! Really? Am I? AM I?? Then? how? whO? WHAT!!!!!! I AM! No. Not. NO!!! Ahh… nooo…. That's… but? Why… ahhh…. that's… erm…. ahhh…. ermmm……th..a..t…'s…….er..m…m….m……wh….a..t……why…...........ah.h….h..hhh…h…hhhh…………………….
`,   
    listenUrl: 'https://youtu.be/dkDSuTQ6C3U'
  },
  {
    id: '19-sets-of-sound-objects',
    title: '19 sets of sound object(s)',
    categories: ['Featured', 'Chamber'],
    year: '2023',
    instrumentation: 'Flute, Clarinet, Horn, Trumpet, Percussion, Harp, Violin, Viola, Cello, Double Bass',
    duration: '25 mins',
    premiere: {
      date: '23 JUN 2023',
      occasion: 'Samuel Hong-yu LEUNG’s Graduation Concert (Bachelor)',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Conductor: Justin Ching-Yin WONG\nTin-ho HUI (flute), Tony Yat-chun LEUNG (clarinet (also bass clarinet)), Quinton Lok-sang CHU (horn), Kasper Chi-huen CHAN (trumpet), Sam LAU (percussion), Milly Yee-tung CHAN (harp), Arthur Hin-hei TSANG (violin), Jacky Pok-yin YUNG (viola), Edmund Tsz-chun POON (cello), Ryley Ho-cheung YIP (double bass)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    programmeNotes: `This was the first piece I wrote right after the influence of philosophy, and the original programme (premiered in my graduation concert of my bachelor’s degree) was so naïve that I would rather hide it. But basically, the naïve original idea was to use the music to find my true self under ideology. That’s why, when I was sitting in front of my composing desk, I was encouraged by myself to compose with the given instrumentation whatever I want at the moment. The objects are fragmented and undeveloped, soundscapes change drastically from one to another. Though structurally arbitrary, beauty is what I was thinking consistently while composing.

Later, some reflection after the premiere, what struck me the most was the idea that the improvisatory nature may confine myself within the boundary of cultural predispositions. While my initial approach was driven by a desire to explore my authentic self, I now recognize this rather unconscious approach of sound production might obstruct myself to navigate beyond cultural clichés. However, by analysing this quasi extemporary piece, which is a good way to know what shaped my sound identity and, thus, to project a plateau for me to break my walls and to go beyond myself in the future.
`,   
    listenUrl: 'https://youtu.be/77tq__Q6SBE?si=jix6FIFlkpkXVq6Q'
  },
  {
    id: 'variations',
    title: 'Variations',
    categories: ['Featured', 'Chamber'],
    year: '2022',
    instrumentation: 'String Quartet',
    duration: '6 mins',
    remarks: 'Represented Hong Kong sector in the International Society for Contemporary Music (ISCM) World New Music Days in Portugal',
    premiere: {
      date: '30 Apr 2023',
      occasion: 'Mivos Quartet at CUHK - an online residency',
      venue: '',
      location: 'Online',
      performer: 'Mivos Quartet: Olivia DE PRATO (violin I), Maya BENNARDO (violin II), Victor Lowrie TAFOYA (viola), Nathan WATTS (cello)'
    },
    otherPerformances: [
        {
            date: '07 JUN 2025',
            occasion: 'International Society for Contemporary Music (ISCM) World New Music Days - Other Shores',
            venue: 'Jerónimos Monastery',
            location: 'Lisbon, Portugal',
            ticketUrl: 'https://www.museusemonumentos.pt/pt/agenda/concerto-de-encerramento-do-world-new-music-days-2025',
            performer: 'Solistas da Metropolitana: José PEREIRA (violin I), Ana PEREIRA (violin II), Joana CIPRIANO (viola), Nuno ABREU (cello)'
        },
      ],
    programmeNotes: `As Cantonese is a tonal language, different tones will convey different meaning. The piece employs the nine tones of the dialect as a recurring “theme”.
`,
    listenUrl: 'https://youtu.be/-I_jotYTQZA'
  },
  {
    id: 'time tunnel',
    title: 'Time Tunnel',
    categories: ['Large Ensemble'],
    year: '2023',
    instrumentation: 'Chinese Orchestra',
    duration: '4 mins 30 secs',
    premiere: {
      date: '04 MAR 2023',
      occasion: 'Music from the Heart - 46<sup>th</sup> Orchestral Season',
      venue: 'HKCO Recital Hall',
      location: 'Hong Kong',
      ticketUrl: 'https://www.hkco.org/tc/Concerts/Music-From-The-Heart-6.html',
      performer: 'Hong Kong Chinese Orchestra, Hee-chiat CHEW (conductor)',
      mapUrl: 'https://maps.app.goo.gl/oVLELxFqrKpiNN5K9'
    },
    programmeNotes: `Let's step into the time tunnel with the surge of excitement and revisit the places that once electrified us.
`,
    listenUrl: '#'
  },
  {
    id: 'capturing',
    title: 'Capturing',
    categories: ['Chamber'],
    year: '2022',
    instrumentation: 'Accordion, Flute, Guitar, Violin, Cello',
    duration: '7 mins 30 secs',
    remarks: 'Commissioned by the Hong Kong Composers’ Guild',
    premiere: {
      date: '17 DEC 2022',
      occasion: 'Hong Kong Contemporary Music Festival: Global Delights',
      venue: '',
      location: 'Zagreb, Croatia',
      performer: 'Martina JEMBRIŠAK (accordion), Andrea JELAVIC (flute), Marta STANEĆ (violin), Vid VELIAK (cello), Lovro PERETIĆ (guitar)'
    },
    programmeNotes: `This was commissioned by the Hong Kong Composer’s Guild (HKCG) for the “Hong Kong Contemporary Music Festival - Global Delights”. Recorded by musicians from Croatia. The piece was written for Hong Kong, as I witnessed different changes in my hometown, it is always heart-breaking to encounter the departure of something or someone valuable to me. Yet, the frequency of having that painfulness has increased in recent years. Despite being supposed to be my home, it has become more and more unfamiliar to me. This piece tries to capture the sense of fading, yet still securing the feeling that something will be remembered.

This piece takes an allegorical approach between sound and memory. Pitches, noises, and silences are as markings within a spectrum: when pitch faded out, noise remain; when noise faded out, silence remain. The closer the sound to the pitch spectrum, the clearer the memory it is.
`,
    listenUrl: 'https://youtu.be/xPKjzegop9A?t=2110'
  },
  {
    id: 'it-is-coming-iii',
    title: 'it is Coming III',
    categories: ['Featured', 'Chamber'],
    year: '2022',
    instrumentation: 'Violin, Traditional Gaohu',
    duration: '5 mins',
    premiere: {
      date: '11 NOV 2022',
      occasion: 'Bauhinia Concert 2022',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Samuel Hong-yu LEUNG (violin), Justin Ching-yin WONG (traditional gaohu)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    otherPerformances: [
        {
            date: '23 JUN 2023',
            occasion: 'Samuel Hong-yu LEUNG’s Graduation Concert (Bachelor)',
            venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
            location: 'Hong Kong',
            performer: 'Samuel Hong-yu LEUNG (violin), Justin Ching-yin WONG (traditional gaohu)',
            mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
        },
      ],
    programmeNotes: `I was significantly influenced by Musique concrète instrumentale. The ‘it is Coming’ series aims to capture my excitement in discovering Lachenmann’s music and to exploit the sounds that were being suppressed, organized in my own way, utilizing daily sound fragments to structure the composition.

This very piece, ‘it is Coming III’, unlike the previous pieces of this series, delineates a less fragmented structure and incorporates the voices from the instrumentalists while juxtaposing Western and Chinese instruments at the same time. It is always interesting for me to witness the chemistry between the products from these two culture.
`,
    listenUrl: 'https://youtu.be/3nKidgXXxl0'
  },
  {
    id: 'unity-and-contrast',
    title: 'Unity and Contrast',
    categories: ['Solo', 'With Electronics/ Installations'],
    year: '2022',
    instrumentation: 'Bassoon, Wind Chimes Installation',
    duration: '6 mins 40 secs',
    premiere: {
      date: '28-30 OCT 2022',
      occasion: 'A date with Dogs',
      venue: 'Sun Yat Sen Memorial Park, Sai Ying Pun',
      location: 'Hong Kong',
      ticketUrl: 'https://www.mad.asia/programmes/training/921',
      performer: 'Hong Kong New Music Ensemble: Tak-wing LEUNG (bassoon)',
      mapUrl: 'https://maps.app.goo.gl/2tHz3NoUrmKvASHA7'
    },
    remarks: 'Interdisciplinary project - interactive sound installation and music for dogs with public performances and garden tours in 5 urban parks',
    programmeNotes: `The piece portrays a soundscape without segments, but various musical elements interlace. Humans and other species are like this piece, sharing commonalities and differences. Living in the same world, understanding and caring about what is around us make these distinctive features beautiful.
`,
    listenUrl: 'https://youtu.be/NzPWz96kffE'
  },
  {
    id: '聽風',
    title: '聽風 (arr.)',
    categories: ['Large Ensemble'],
    year: '2022',
    instrumentation: 'Cello, Chamber Orchestra',
    duration: '4 mins',
    premiere: {
      date: '11 JUL 2022',
      occasion: 'Karina Hing-kei CHAN’s Graduation Concert',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Soloist: Karina Hing-kei CHAN (cello)\nStudent Orchestra, Jovi Tak-chun LO (conductor)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    listenUrl: 'https://youtu.be/DxarDQGGcFg'
  },
  {
    id: 'quotation-of-moment',
    title: 'Quotation of Moments',
    categories: ['Solo'],
    year: '2022',
    instrumentation: 'Violin',
    duration: '7 mins 20 secs',
    premiere: {
      date: '23 JUN 2022',
      occasion: 'Kelvin Tze-hin NG’s Graduation Concert',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Kelvin Tze-hin NG (violin)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    remarks: 'Dedicated to and commissioned by Kelvin Tze-hin NG',
    programmeNotes: `It was commissioned by my good friend Kelvin for his graduation concert. When he asked me to write a solo violin work, I had originally intended to write a showpiece for Kelvin. It wasn't until the last month that I decided it would be fun to include some of our shared moments in the composition. The “quotations” not only include direct musical references, such as playing Mahler’s symphony No.2 together in a student orchestra, sight reading Alban Berg’s Violin Concerto in practice room, discussing pedagogical approach on Vivaldi’s Autumn, but also include “non-musical” moments, such as watching football together, and my impression to his personality, which are conceptualized and translated into sounds and the structure. This piece, recalls and cites multiple points from the past. Some are exact, some are vague, as if they were a part of my memory.
`,
    listenUrl: 'https://youtu.be/ukGTFnBQQC0'
  },
  {
    id: 'excursion',
    title: 'Excursion',
    categories: ['Chamber'],
    year: '2022',
    instrumentation: 'Flute, Clarinet, Violin, Cello, Piano',
    duration: '6 mins 20 secs',
    premiere: {
      date: '21 JUN 2022',
      occasion: 'Ensemble-in-Residence 2022',
      venue: 'Chung Chi College Chapel, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Ivy Suet-Wah CHUANG (flute), Lorenzo Antonio IOSCO (bb clarinet), Gallant Ka-Leung HO (violin), Kai-Hei CHOR (cello), Ling HUI (piano)',
      mapUrl: 'https://maps.app.goo.gl/TxrPBC9FSFZE87yv6'
    },
    remarks: 'Won the David Gwilt Prize',
    listenUrl: '#'
  },
  {
    id: 'it-is-coming-ii',
    title: 'it is Coming II',
    categories: ['Solo', 'With Electronics/ Installations'],
    year: '2021',
    instrumentation: 'Traditional Gaohu, Electronics',
    duration: '9 mins 20 secs',
    premiere: {
      date: '03 DEC 2021',
      occasion: 'Composition I Concert',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Justin Ching-yin WONG (traditional gaohu)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    otherPerformances: [
        {
            date: '23 JUN 2023',
            occasion: 'Samuel Hong-yu LEUNG’s Graduation Concert (Bachelor)',
            venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
            location: 'Hong Kong',
            performer: 'Justin Ching-yin WONG (traditional gaohu)',
            mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
        },
      ],
    remarks: 'Dedicated to and commissioned by Justin Ching-yin WONG',
    listenUrl: 'https://youtu.be/OiV7_XeLkqI'
  },
  {
    id: 'it-is-coming-i',
    title: 'it is Coming I',
    categories: ['Solo', 'With Electronics/ Installations'],
    year: '2021',
    instrumentation: 'Amplified Violin',
    duration: '10 mins',
    premiere: {
      date: '12 NOV 2021',
      occasion: 'Bauhinia Concert 2021',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Samuel Hong-yu LEUNG (amplified violin)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    otherPerformances: [
        {
            date: '23 JUN 2023',
            occasion: 'Samuel Hong-yu LEUNG’s Graduation Concert (Bachelor)',
            venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
            location: 'Hong Kong',
            performer: 'Samuel Hong-yu LEUNG (amplified violin)',
            mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
        },
      ],
    listenUrl: '#'
  },
  {
    id: 'finding-the-light',
    title: '盼 Finding The Light',
    categories: ['Featured', 'Large Ensemble'],
    year: '2021',
    instrumentation: 'Large Chinese Orchestra',
    duration: '5 mins 30 secs',
    premiere: {
      date: '17-18 SEP 2021',
      occasion: 'The 45<sup>th</sup> Season Opening ConcertOne Hundred Chinese Music Classics Select III - Peony Pavilion and The Yellow Earth',
      venue: 'Hong Kong Cultural Centre',
      location: 'Hong Kong',
      ticketUrl: 'https://www.hkco.org/tc/Concerts/One-Hundred-Chinese-Music-Classics-Select-Iii----Peony-Pavilion-And-The-Yellow-Earth.html',
      performer: 'Hong Kong Chinese Orchestra, Huichang YAN (conductor)',
      mapUrl: 'https://maps.app.goo.gl/yz92gmybJYdpUzXR6'
    },
    remarks: '45<sup>th</sup> Season Opening Concert of the Hong Kong Chinese Orchestra (HKCO); Commissioned by HKCO',
    programmeNotes: `When I was composing this piece, Hong Kong was facing a downturn in the pandemic. Things that we thought are the norm quickly became extremely precious in an instance. It was under the pandemic that l've learned to cherish the things more that are around me. It is a gift that a live concert could be held now, and I am very grateful for that. I hope that the music will bring a modicum of hope and courage for the audience to face the future and overcome the pandemic in this difficult era!
`,
    listenUrl: 'https://youtu.be/Ht-Fq1zW9UI'
  },
  {
    id: 'echoes-of-spring',
    title: 'Echoes of Spring',
    categories: ['Chamber'],
    year: '2020',
    instrumentation: 'Clarinet, Violin, Cello, Percussion',
    duration: '4 mins 30 secs',
    premiere: {
      date: '10 AUG 2021',
      occasion: 'New Generation 2020',
      venue: 'Y-Studio, Youth Square',
      location: 'Chai Wan, Hong Kong',
      ticketUrl: 'https://www.hkcg.org/new-generation-2020-2021',
      performer: 'Conductor: Angus LEE\nNova Ensemble: Stephenie NG (clarinet), Sean LI (violin), Chak-yin PUN (cello), Karen YU (percussion)',
      mapUrl: 'https://maps.app.goo.gl/cG3qFzsyAPp3dKPy5'
    },
    remarks: 'Winner of New Generation 2020',
    programmeNotes: `Spring, represents the start of a year and blossoming. The piece expresses the tirelessness of nature and depicts the thrive of it with a 3-note ascending motif that occurring in anywhere. The Composition falls into an AB-coda structure. Part A is a collection of various small cells and it focused on highlighting the characteristics on each instruments. Where part B took a different approach that all instruments present the sounds in a more united manner. At the same time, the use Tabla will also allow the piece to explore the timbre of the instrumentation. Finally, the piece ends with the material utilized in part A as a form of coda.
`,
    listenUrl: '#'
  },
  {
    id: 'the-ever-changing-city',
    title: '城變 the Ever-changing City',
    categories: ['Large Ensemble'],
    year: '2021',
    instrumentation: 'Chinese Orchestra',
    duration: '6 mins',
    programmeNotes: `The music does not depict any particular scenario, but purely captures the emotions that arise from the changes in the surroundings of people.
`,
    premiere: {
      date: '19 MAR 2021',
      occasion: 'Music from the Heart - 44<sup>th</sup> Orchestral Season',
      venue: 'HKCO Recital Hall',
      location: 'Hong Kong',
      ticketUrl: 'https://www.hkco.org/tc/Concerts/Music-From-The-Heart-4.html',
      performer: 'Hong Kong Chinese Orchestra, Hee-chiat CHEW (conductor)',
      mapUrl: 'https://maps.app.goo.gl/oVLELxFqrKpiNN5K9'
    },
    listenUrl: '#'
  },
  {
    id: 'medley',
    title: 'Oasis from the City – Medley of Terrance Lam’s Cantonese Song (arr.)',
    categories: ['Chamber'],
    year: '2021',
    instrumentation: 'Huqin quartet',
    duration: '10 mins',
    premiere: {
      date: '15 MAR 2021',
      occasion: 'Chung Chi College Midday Oasis, Joint concert of Huqin Ensemble & Zheng',
      venue: 'Chung Chi College Chapel, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Justin Ching-yin WONG (gaohu), Andy Yung-yiu CHUNG (erhu), Melissa Wing-sam HAU (zhonghu), Karina Hing-kei CHAN (cello)',
      mapUrl: 'https://maps.app.goo.gl/TxrPBC9FSFZE87yv6'
    },
    listenUrl: 'https://youtu.be/Jfn5hAr3WuI?t=704'
  },
  {
    id: 'anechoic-scream',
    title: 'Anechoic Scream',
    categories: ['Chamber'],
    year: '2021',
    instrumentation: 'String Quartet',
    duration: '5 mins 30 secs',
    programmeNotes: `Anechoic Scream depicts a man’s inner thoughts surrounded by a suppressed world. Not able to express one’s self until the last “biggest scream”, which he realized he has lost the ability to let others to know him as an existence. The piece starts with a reflection on one’s suppressed surrounding and the corresponding inner thoughts where the soundscape is chaotic and painful, that gradually changes to a disconnection from the physical world and drive the man to another realm. This results in the [UNSUNG ARIA] section, which has no melody at all, it is just the background of a “song” that somehow resembles the previous part and that the memories flashing inside the man. It is painful, it is sorrow, it is rotten. Everything is so constrained that he cannot sing the “song” out. He screamed, but he cant. At last, he realized himself is in an empty void.
`,
    premiere: {
      date: '19 JAN 2021',
      occasion: 'Ensemble-in-Residence 2021',
      venue: 'Lee Hysan Concert Hall, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Cong Quartet: Francis Yiu-Ting CHIK (violin I), Yip-wai Chow (violin II), Caleb WONG (viola), Yan Ho CHENG (cello)',
      mapUrl: 'https://maps.app.goo.gl/dG8KzLZZfNkdze93A'
    },
    listenUrl: 'https://youtu.be/H3qGxms8Vm4?t=1294'
  },
  {
    id: 'night-thoughts',
    title: '夜醒憶飛 Night Thoughts',
    categories: ['Large Ensemble'],
    year: '2020',
    instrumentation: 'Chinese Orchestra',
    duration: '5 mins 30 secs',
    programmeNotes: `(English version below)

又被吵醒

零碎的思緒不斷閃過重複的餘憶充斥腦袋

熱鬧地

像生鏽般潰壞

累了

又被吵醒

零碎的思緒又再萌生重複的餘憶再次湧現

累了

又被吵醒

零碎的思緒又再萌生重複的餘憶再次湧現

累了

又被吵醒

︙



Awakened once again,

Splintered thoughts flash by,

Echoes of memories repeat,

Crowding my tired mind.

They roar,

Like rust gnawing through steel,

Breaking everything down.Worn thin.

Awakened once again,

Splintered thoughts flash by,

Echoes of memories repeat,

Crowding my tired mind.Worn thin.Awakened once again,

Splintered thoughts flash by,

Echoes of memories repeat,

Crowding my tired mind.Worn thin.

Awakened once again, ...

`,
    premiere: {
      date: '03 JUL 2020',
      occasion: 'Music from the Heart - 5G Live Broadcasting Concert',
      venue: 'Concert Hall, Hong Kong City Hall',
      location: 'Hong Kong',
      ticketUrl: 'https://www.hkco.org/tc/Concerts/Music-From-The-Heart---Online-Concert.html',
      performer: 'Hong Kong Chinese Orchestra, Hee-chiat CHEW (conductor)',
      mapUrl: 'https://maps.app.goo.gl/gd1nDggeq3BsJFio7'
    },
    listenUrl: 'https://www.youtube.com/live/dAUCUiV3eWI?si=zLNoH-9OLVI_FR01&t=4581'
  },
  {
    id: 'deadline-jitters',
    title: 'Deadline Jitters',
    categories: ['Chamber'],
    year: '2020',
    instrumentation: 'String Quartet',
    duration: '5 mins 30 secs',
    programmeNotes: `This piece is a depiction of the inner world of a being who works on the edge of deadlines. His poor time management drives him crazy when the deadline is near. Contradiction in his mind can be seen by shifting between the tonal part and strong dissonance, representing the eager to procrastinate and the unwilling to face his work respectively. Tik-tok-tik-tok, the time is ticking, his time become lesser and lesser…
`,
    premiere: {
      date: '06 MAY 2020',
      occasion: 'Ensemble-in-Residence 2020',
      venue: 'Chung Chi College Chapel, The Chinese University of Hong Kong',
      location: 'Hong Kong',
      performer: 'Cong Quartet: Francis Yiu-Ting CHIK (violin I), Sally LAW (violin II), Caleb WONG (viola), Yan Ho CHENG (cello)',
      mapUrl: 'https://maps.app.goo.gl/TxrPBC9FSFZE87yv6'
    },
    listenUrl: '#'
  },
];

// Standalone events are for things only presenting on Upcoming or Past Events
export const STANDALONE_EVENTS: UpcomingEvent[] = [
  {
    id: 'evt-04',
    occasionRemarks: "[Presentation]:",
    occasion: "HKU Composers’ Symposium 2025",
    date: '28-29 AUG 2025',
    venue: 'RRST 11/F, Seminar Room, Hong Kong University',
    location: 'Hong Kong',
    performers: 'Department of Music, The University of Hong Kong',
    program: '[Presentation]: Material, Memory & Expectation: an Exploration of my Tastaturlust for solo piano',
    ticketUrl: 'https://www.music.hku.hk/hku-composers-symposium-2025.html',
    mapUrl: 'https://maps.app.goo.gl/Fdf8KHEDoSWcdC4YA'
  },
  {
    id: 'evt-03',
    occasion: 'ZfGM 2026',
    date: '18-20 JUN 2026',
    venue: 'Probesaal, HMT Leipzig, Grassistraße 8',
    location: 'Leipzig, Germany',
    performers: 'Contemporary Insights',
    program: '[New Piece]',
    ticketUrl: 'https://www.hmt-leipzig.de/news-events/zfgm-festival-2026',
    mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
  },
  {
    id: 'masters-graduation-concert',
    occasion: "Master's Graduation Concert",
    date: '09 JUL 2026',
    venue: 'Probesaal, HMT Leipzig, Grassistraße 8',
    location: 'Leipzig, Germany',
    performers: '[TBA]',
    program: '[pieces by Samuel Hong-Yu LEUNG]',
    ticketUrl: '',
    mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
  },
  {
    id: '[violin-plying-in]-masters-graduation-concert-(kefan-Chen)',
    occasionRemarks: "Violin Playing in:",
    occasion: "Master's Graduation Concert (Kefan Chen)",
    date: '09 JUL 2026',
    venue: 'Probesaal, HMT Leipzig, Grassistraße 8',
    location: 'Leipzig, Germany',
    performers: 'Kefan Chen & Wenjie HU: [TBA]',
    program: '[violin]',
    ticketUrl: '',
    mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
  },
  {
    id: '[violin-playing-in]-Diplome-Komposition-Theorie-2026',
    occasionRemarks: "Violin Playing in:",
    occasion: "Diplome Komposition / Theorie 2026",
    date: '27 MAY 2026',
    venue: 'Toni-Areal, Konzertsaal 1, Ebene 7, Pfingstweidstrasse 96, Zurich University of Arts',
    location: 'Zurich, Switzerland',
    performers: 'Kefan Chen & Wenjie HU: [TBA]',
    program: '[violin]',
    ticketUrl: 'https://www.zhdk.ch/en/event/60330',
    mapUrl: 'https://maps.app.goo.gl/ssNhu5Ubw1mJy92cA'
  },
  {
    id: '[violin-playing-in]-ZfGM-2026',
    occasionRemarks: "Violin Playing in:",
    occasion: "Musik & Gegenwart 116",
    date: '29 APR 2026',
    venue: 'Probesaal, HMT Leipzig, Grassistraße 8',
    location: 'Leipzig, Germany',
    performers: 'August Christian Hübner',
    program: '[violin]',
    ticketUrl: 'https://www.hmt-leipzig.de/news-events/konzert-musik-gegenwart-116',
    mapUrl: 'https://maps.app.goo.gl/os2nfSDvZDJPGh4J9'
  },
];

export const getAllEvents = (): UpcomingEvent[] => {
  const events: UpcomingEvent[] = [...STANDALONE_EVENTS];

  WORKS.forEach(work => {
    const processPerformance = (perf: any, isPremiere: boolean) => {
      events.push({
        id: `${work.id}-${perf.date.replace(/\s+/g, '-')}`,
        occasion: perf.occasion || work.title,
        date: perf.date,
        location: perf.location,
        venue: perf.venue,
        performers: perf.performer,
        program: work.title,
        ticketUrl: perf.ticketUrl,
        mapUrl: perf.mapUrl
      });
    };

    if (work.premiere) {
      processPerformance(work.premiere, true);
    }
    if (work.otherPerformances) {
      work.otherPerformances.forEach(perf => processPerformance(perf, false));
    }
  });

  events.sort((a, b) => {
    const parseDate = (dateStr: string) => {
      const cleaned = dateStr.replace(/(\d+)-\d+\s/, ' ');
      return new Date(cleaned).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return events;
};
