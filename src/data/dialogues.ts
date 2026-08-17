export type DialogueLine = {
  who: string
  cyr: string
  lat: string
  fr: string
}

export type Dialogue = {
  id: string
  title: string
  place: string
  hint: string
  lines: DialogueLine[]
}

export const dialogues: Dialogue[] = [
  {
    id: 'd1',
    title: 'Se présenter',
    place: 'Une rencontre',
    hint: 'Сіз dès le premier échange. Le prénom se glisse après атым.',
    lines: [
      { who: 'A', cyr: 'Сәлеметсіз бе!', lat: 'Sälemetsiz be!', fr: 'Bonjour !' },
      { who: 'B', cyr: 'Сәлеметсіз бе! Сіздің атыңыз кім?', lat: 'Sälemetsiz be! Sizdiñ atyñyz kim?', fr: 'Bonjour ! Comment vous appelez-vous ?' },
      { who: 'A', cyr: 'Менің атым Стефан. Сіз ше?', lat: 'Meniñ atym Stefan. Siz şe?', fr: 'Je m’appelle Stéphane. Et vous ?' },
      { who: 'B', cyr: 'Менің атым Айгерім. Танысқаныма қуаныштымын.', lat: 'Meniñ atym Aigerim. Tanysqanyma quanyshtymyn.', fr: 'Je m’appelle Aigerim. Enchantée.' },
      { who: 'A', cyr: 'Мен қазақша үйренемін.', lat: 'Men qazaqşa üirenemin.', fr: 'J’apprends le kazakh.' },
      { who: 'B', cyr: 'Жақсы! Баяу сөйлейін.', lat: 'Jaqsy! Bayu söileiin.', fr: 'Très bien ! Je parlerai lentement.' },
    ],
  },
  {
    id: 'd2',
    title: 'Le thé',
    place: 'Chez l’hôte',
    hint: 'Refuser le premier bol est parfois poli — on insiste, vous acceptez le second.',
    lines: [
      { who: 'Hôte', cyr: 'Қош келдіңіз! Отырыңыз.', lat: 'Qoş keldiñiz! Otyryñyz.', fr: 'Bienvenue ! Asseyez-vous.' },
      { who: 'Vous', cyr: 'Рақмет сізге.', lat: 'Raqmet sizge.', fr: 'Merci à vous.' },
      { who: 'Hôte', cyr: 'Шай ішесіз бе?', lat: 'Şai işesiz be?', fr: 'Vous prenez du thé ?' },
      { who: 'Vous', cyr: 'Иә, өтінемін.', lat: 'Iä, ötinemin.', fr: 'Oui, s’il vous plaît.' },
      { who: 'Hôte', cyr: 'Қант бар ма, сүт бар ма?', lat: 'Qant bar ma, süt bar ma?', fr: 'Du sucre, du lait ?' },
      { who: 'Vous', cyr: 'Қант аз ғана. Дәмді екен!', lat: 'Qant az ğana. Dämdi eken!', fr: 'Juste un peu de sucre. C’est délicieux !' },
    ],
  },
  {
    id: 'd3',
    title: 'Au bazar',
    place: 'Green Bazaar, Almaty',
    hint: 'On peut demander арзанырақ — moins cher — sans offenser, avec le sourire.',
    lines: [
      { who: 'Vous', cyr: 'Сәлеметсіз бе! Бұл алма қанша тұрады?', lat: 'Sälemetsiz be! Būl alma qanşa tūrady?', fr: 'Bonjour ! Combien coûtent ces pommes ?' },
      { who: 'Vendeur', cyr: 'Бір келі 800 теңге.', lat: 'Bir keli 800 teñge.', fr: '800 tenges le kilo.' },
      { who: 'Vous', cyr: 'Арзанырақ бола ма?', lat: 'Arzanyraq bola ma?', fr: 'Vous pouvez faire moins cher ?' },
      { who: 'Vendeur', cyr: '700 теңге. Аласыз ба?', lat: '700 teñge. Alasız ba?', fr: '700 tenges. Vous prenez ?' },
      { who: 'Vous', cyr: 'Иә, екі келі аламын.', lat: 'Iä, eki keli alamyn.', fr: 'Oui, j’en prends deux kilos.' },
      { who: 'Vendeur', cyr: 'Рақмет, сау болыңыз!', lat: 'Raqmet, sau bolyñyz!', fr: 'Merci, au revoir !' },
    ],
  },
  {
    id: 'd4',
    title: 'Le chemin',
    place: 'En ville',
    hint: 'Қайда = où. Солға / оңға / тіке : gauche, droite, tout droit.',
    lines: [
      { who: 'Vous', cyr: 'Кешіріңіз, вокзал қайда?', lat: 'Keşiriñiz, vokzal qaida?', fr: 'Excusez-moi, où est la gare ?' },
      { who: 'Passant', cyr: 'Тіке барыңыз, сосын солға бұрылыңыз.', lat: 'Tike baryñyz, sosyn solğa būrylyñyz.', fr: 'Allez tout droit, puis tournez à gauche.' },
      { who: 'Vous', cyr: 'Жақын ба?', lat: 'Jaqyn ba?', fr: 'C’est près ?' },
      { who: 'Passant', cyr: 'Он минут жаяу.', lat: 'On minut jayau.', fr: 'Dix minutes à pied.' },
      { who: 'Vous', cyr: 'Көп рақмет!', lat: 'Köp raqmet!', fr: 'Merci beaucoup !' },
    ],
  },
  {
    id: 'd5',
    title: 'À l’hôtel',
    place: 'Réception',
    hint: 'Бөлме = chambre. Бар ма ? = y en a-t-il ?',
    lines: [
      { who: 'Vous', cyr: 'Кеш жарық. Бір бөлме бар ма?', lat: 'Keş jaryq. Bir bölme bar ma?', fr: 'Bonsoir. Avez-vous une chambre ?' },
      { who: 'Réception', cyr: 'Иә бар. Қанша күн?', lat: 'Iä bar. Qanşa kün?', fr: 'Oui. Pour combien de jours ?' },
      { who: 'Vous', cyr: 'Екі күн. Қанша тұрады?', lat: 'Eki kün. Qanşa tūrady?', fr: 'Deux jours. Combien ça coûte ?' },
      { who: 'Réception', cyr: 'Түнге 25 000 теңге. Паспорт бар ма?', lat: 'Tünge 25 000 teñge. Pasport bar ma?', fr: '25 000 tenges la nuit. Vous avez un passeport ?' },
      { who: 'Vous', cyr: 'Иә, міне. Wi-Fi паролі қандай?', lat: 'Iä, mine. Wi-Fi paroli qandai?', fr: 'Oui, le voici. Quel est le mot de passe Wi-Fi ?' },
      { who: 'Réception', cyr: 'Қонақжай. Жақсы демалыс!', lat: 'Qonaqjai. Jaqsy demalys!', fr: 'C’est « qonaqjai ». Bon séjour !' },
    ],
  },
]
