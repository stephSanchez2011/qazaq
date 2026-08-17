import type { GrammarLesson } from './types'

export const grammarFr: GrammarLesson[] = [
  {
    id: 'articles',
    title: 'Артикль: le, la, les, un, une',
    summary: 'Французша зат есімнің алдында көбіне артикль тұрады.',
    body: [
      'le — ер тек, жекеше (le thé). la — әйел тек (la maison). les — көпше.',
      'un / une — белгісіз: un ami, une pomme.',
      'Дауысты алдында le/la → l’ : l’eau, l’école.',
      'Қазақшада артикль жоқ: кітап = le livre немесе un livre — контекст шешеді.',
    ],
    examples: [
      { cyr: 'шай', lat: 'şai', fr: 'le thé' },
      { cyr: 'үй', lat: 'üi', fr: 'la maison' },
      { cyr: 'дос', lat: 'dos', fr: 'un ami' },
    ],
  },
  {
    id: 'etre-avoir',
    title: 'être және avoir',
    summary: 'Екі негізгі етістік: болу және бар болу.',
    body: [
      'être : je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.',
      'avoir : j’ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.',
      'Қазақша «мен мұғаліммін» → je suis enseignant.',
      '«кітабым бар» → j’ai un livre (avoir), бар емес.',
    ],
    examples: [
      { cyr: 'Мен студентпін.', lat: 'Men studentpin.', fr: 'Je suis étudiant.' },
      { cyr: 'Үйім бар.', lat: 'Üiim bar.', fr: 'J’ai une maison.' },
      { cyr: 'Сіз мұғалімсіз.', lat: 'Siz muğalimsiz.', fr: 'Vous êtes enseignant.' },
    ],
  },
  {
    id: 'tu-vous',
    title: 'tu және vous',
    summary: 'Сен / сіз сияқты: жақындық пен құрмет.',
    body: [
      'tu — достар, балалар, отбасы (сен).',
      'vous — бейтаныс, үлкендер, ресми сөйлесу (сіз). Көпше де vous.',
      'Күмәндансаңыз — vous. Кейін tu ұсынылады.',
      'Етістік өзгереді: tu vas / vous allez.',
    ],
    examples: [
      { cyr: 'Сен қалайсың?', lat: 'Sen qalaisyñ?', fr: 'Comment tu vas ?' },
      { cyr: 'Сіз қалайсыз?', lat: 'Siz qalaisyz?', fr: 'Comment allez-vous ?' },
      { cyr: 'Рақмет сізге.', lat: 'Raqmet sizge.', fr: 'Merci à vous.' },
    ],
  },
  {
    id: 'genre',
    title: 'Тек: masculin / féminin',
    summary: 'Зат есімнің тегі бар. Ережелер көп, сөзбен жаттаңыз.',
    body: [
      '-e жиі әйел тек: une pomme, une école. Бірақ le père, le frère — ер тек.',
      'Сын есім текті қуалайды: un grand thé, une grande ville.',
      'Қазақшада грамматикалық тек жоқ: ол = il немесе elle.',
      'Адамдарда: il = ер, elle = әйел.',
    ],
    examples: [
      { cyr: 'үлкен қала', lat: 'ulken qala', fr: 'une grande ville' },
      { cyr: 'әке', lat: 'äke', fr: 'le père' },
      { cyr: 'ана', lat: 'ana', fr: 'la mère' },
    ],
  },
  {
    id: 'negation',
    title: 'Болымсыздық: ne … pas',
    summary: 'Етістікті ne мен pas ортасына алады.',
    body: [
      'je ne comprends pas — түсінбеймін.',
      'Дауысты алдында ne → n’ : je n’ai pas.',
      'Ауызекі тілде ne жиі түсіп қалады: je comprends pas. Үйренгенде екеуін де айтыңыз.',
      'Қазақша жоқ сөйлемнің соңында: уақытым жоқ.',
    ],
    examples: [
      { cyr: 'Түсінбеймін.', lat: 'Tüsinbeimın.', fr: 'Je ne comprends pas.' },
      { cyr: 'Уақытым жоқ.', lat: 'Uaqytym joq.', fr: 'Je n’ai pas le temps.' },
      { cyr: 'Жоқ, рақмет.', lat: 'Joq, raqmet.', fr: 'Non, merci.' },
    ],
  },
  {
    id: 'questions-fr',
    title: 'Сұрақ қою',
    summary: 'Үш жолы: интонация, est-ce que, инверсия.',
    body: [
      'Vous prenez du thé ? — дауыс көтеріледі.',
      'Est-ce que vous prenez du thé ? — ең ыңғайлы жазбаша жол.',
      'Prenez-vous du thé ? — ресми.',
      'Сұрау сөздері: qui, que, où, quand, pourquoi, comment, combien.',
    ],
    examples: [
      { cyr: 'Бұл не?', lat: 'Būl ne?', fr: 'Qu’est-ce que c’est ?' },
      { cyr: 'Қайда тұрасыз?', lat: 'Qaida tūrasız?', fr: 'Où habitez-vous ?' },
      { cyr: 'Қанша тұрады?', lat: 'Qanşa tūrady?', fr: 'Combien ça coûte ?' },
    ],
  },
]
