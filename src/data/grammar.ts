import type { GrammarLesson } from './types'

export const grammar: GrammarLesson[] = [
  {
    id: 'voyelles',
    title: 'Voyelles et harmonie',
    summary: 'Le kazakh range ses voyelles en deux camps : antérieures et postérieures.',
    body: [
      'Les voyelles postérieures (arrière) : а, о, ұ, ы, у.',
      'Les voyelles antérieures (avant) : ә, ө, ү, і, е, и.',
      'Un mot kazakh « pur » n’aime pas mélanger les deux camps. Les suffixes suivent la dernière voyelle du mot.',
      'Exemple : кітап (livre, voyelle postérieure а) → кітапта (dans le livre). үй (maison, voyelle antérieure ү) → үйде (dans la maison).',
      'Les emprunts (телефон, автобус) cassent parfois la règle : apprenez-les tels quels.',
    ],
    examples: [
      { cyr: 'қалада', lat: 'qalada', fr: 'en ville (қала + да)' },
      { cyr: 'мектепте', lat: 'mektepte', fr: 'à l’école (мектеп + те)' },
      { cyr: 'үйден', lat: 'üiden', fr: 'de la maison (үй + ден)' },
    ],
  },
  {
    id: 'pronoms',
    title: 'Les pronoms',
    summary: 'Huit formes essentielles, avec une distinction nette entre tutoiement et vouvoiement.',
    body: [
      'мен je · сен tu · сіз vous (poli) · ол il/elle.',
      'біз nous · сендер vous (pluriel tutoiement) · сіздер vous (pluriel poli) · олар ils/elles.',
      'Il n’y a pas de genre grammatical : ол veut dire il, elle ou même cela.',
      'Pour dire « mon / ton / son », on ajoute un possessif au nom : атым (mon nom), атыңыз (votre nom).',
    ],
    examples: [
      { cyr: 'Мен студентпін.', lat: 'Men studentpin.', fr: 'Je suis étudiant.' },
      { cyr: 'Сен қазақсың.', lat: 'Sen qazaqsıñ.', fr: 'Tu es Kazakh.' },
      { cyr: 'Сіз мұғалімсіз.', lat: 'Siz muğalimsiz.', fr: 'Vous êtes enseignant.' },
    ],
  },
  {
    id: 'etre',
    title: 'Pas de « être » au présent',
    summary: 'Au présent, le kazakh n’emploie pas de verbe « être » séparé : l’identité se colle au mot.',
    body: [
      'Français : je suis français. Kazakh : мен французбын — le -бын porte « je suis ».',
      'Tu es : -сың / -сің. Vous êtes : -сыз / -сіз. Il/elle est : souvent rien, ou -ды/-ді.',
      'Au passé, on utilise еді (était) : мен бала едім — j’étais un enfant.',
      'Pour la localisation, préférez бар (il y a) plutôt que calquer « être ».',
    ],
    examples: [
      { cyr: 'Бұл кітап.', lat: 'Būl kitap.', fr: 'Ceci est un livre.' },
      { cyr: 'Ол мұғалім.', lat: 'Ol muğalim.', fr: 'Il/elle est enseignant.' },
      { cyr: 'Біз доспыз.', lat: 'Biz dospyz.', fr: 'Nous sommes amis.' },
    ],
  },
  {
    id: 'bar-joq',
    title: 'Бар et жоқ',
    summary: 'Deux petits mots pour tout ce qui existe — ou n’existe pas.',
    body: [
      'бар = il y a, j’ai, c’est disponible.',
      'жоқ = il n’y a pas, je n’ai pas.',
      '« J’ai un livre » se dit кітабым бар (mon livre existe), pas un verbe « avoir ».',
      'Pour demander : бар ма ? — y en a-t-il ? La particule ма/ме/ба/бе/па/пе suit l’harmonie vocalique.',
    ],
    examples: [
      { cyr: 'Су бар ма?', lat: 'Su bar ma?', fr: 'Y a-t-il de l’eau ?' },
      { cyr: 'Уақытым жоқ.', lat: 'Uaqytym joq.', fr: 'Je n’ai pas le temps.' },
      { cyr: 'Үйім бар.', lat: 'Üiim bar.', fr: 'J’ai une maison.' },
    ],
  },
  {
    id: 'cas',
    title: 'Les sept cas',
    summary: 'Le kazakh décline les noms. Apprenez d’abord le sens, pas toutes les exceptions.',
    body: [
      'Nominatif : forme du dictionnaire — кітап (un livre).',
      'Génitif -ның/-нің : de, possession — кітаптың беті (la page du livre).',
      'Datif -ға/-ге : vers, pour — үйге (à la maison).',
      'Accusatif -ны/-ні : objet défini — кітапты оқыдым (j’ai lu le livre).',
      'Locatif -да/-де : dans, à, sur — қалада (en ville).',
      'Ablatif -дан/-ден : depuis, de — мектептен (de l’école).',
      'Instrumental -мен : avec — доспен (avec un ami).',
    ],
    examples: [
      { cyr: 'Мен үйге барамын.', lat: 'Men üige baramyn.', fr: 'Je vais à la maison.' },
      { cyr: 'Ол қалада тұрады.', lat: 'Ol qalada tūrady.', fr: 'Il/elle habite en ville.' },
      { cyr: 'Доспен келдім.', lat: 'Dospen keldim.', fr: 'Je suis venu avec un ami.' },
    ],
  },
  {
    id: 'questions',
    title: 'Poser une question',
    summary: 'Mots interrogatifs + une petite particule en fin de phrase.',
    body: [
      'кім qui · не quoi · қайда où · қашан quand · неге pourquoi · қалай comment · қанша combien.',
      'Pour une question oui/non, ajoutez ма/ме/ба/бе/па/пе après le mot important.',
      'Сіз мұғалімсіз бе? — Êtes-vous enseignant ?',
      'Le ton monte un peu, mais la particule suffit à marquer la question.',
    ],
    examples: [
      { cyr: 'Бұл не?', lat: 'Būl ne?', fr: 'Qu’est-ce que c’est ?' },
      { cyr: 'Сен барасың ба?', lat: 'Sen barasyñ ba?', fr: 'Tu y vas ?' },
      { cyr: 'Қайда тұрасыз?', lat: 'Qaida tūrasız?', fr: 'Où habitez-vous ?' },
    ],
  },
  {
    id: 'poli',
    title: 'Tutoiement et politesse',
    summary: 'Сен pour les proches, сіз dès que le respect entre en jeu.',
    body: [
      'Tutoyez (сен) les enfants, les amis intimes, parfois les collègues du même âge si l’on vous y invite.',
      'Vouvoyez (сіз) les aînés, les inconnus, les commerçants, les enseignants.',
      'Les verbes et les noms suivent : кел (viens) vs келіңіз (venez).',
      'En cas de doute, choisissez сіз. On vous proposera le tutoiement si c’est trop formel.',
    ],
    examples: [
      { cyr: 'Кел!', lat: 'Kel!', fr: 'Viens ! (tutoiement)' },
      { cyr: 'Келіңіз.', lat: 'Keliñiz.', fr: 'Venez. (vouvoiement)' },
      { cyr: 'Рақмет сізге.', lat: 'Raqmet sizge.', fr: 'Merci à vous.' },
    ],
  },
  {
    id: 'present',
    title: 'Le présent en -а / -е / -й',
    summary: 'Pour dire ce que l’on fait maintenant — ou en général.',
    body: [
      'On part du verbe, on retire -у/-у, puis on ajoute -а ou -е (harmonie) ou -й après une voyelle.',
      'Ensuite vient la personne : -мын je, -сың tu, -сыз vous, -ды il/elle, -мыз nous, -ды олар.',
      'бару → бара-мын (je vais). келу → келе-мін (je viens). оқу → оқи-мын (j’étudie).',
      'Ce présent couvre l’habitude (« je bois du thé ») autant que l’instant (« je vais au marché »).',
    ],
    examples: [
      { cyr: 'Мен қазақша оқимын.', lat: 'Men qazaqşa oqimyn.', fr: 'J’étudie le kazakh.' },
      { cyr: 'Ол шай ішеді.', lat: 'Ol şai işedi.', fr: 'Il/elle boit du thé.' },
      { cyr: 'Біз үйге барамыз.', lat: 'Biz üige baramyz.', fr: 'Nous allons à la maison.' },
    ],
  },
]
