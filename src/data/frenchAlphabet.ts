import type { AlphabetLetter } from './types'

/**
 * French A–Z for the Kazakh→French track.
 * exampleFr always starts with the letter; exampleCyr/Lat is that word’s meaning;
 * ipa is the sound of the letter in that example (♪ plays exampleFr).
 */
export const frenchAlphabet: AlphabetLetter[] = [
  { cyr: 'A', lat: 'A', name: 'a', ipa: 'a', hint: 'ашық a, « ami »', exampleCyr: 'дос', exampleLat: 'dos', exampleFr: 'ami', core: true },
  { cyr: 'B', lat: 'B', name: 'bé', ipa: 'b', hint: 'b, « bé »', exampleCyr: 'сәлеметсіз бе', exampleLat: 'sälemetsiz be', exampleFr: 'bonjour', core: true },
  { cyr: 'C', lat: 'C', name: 'cé', ipa: 'k/s', hint: 'e, i, y алдында s, әйтпесе k', exampleCyr: 'бес', exampleLat: 'bes', exampleFr: 'cinq', core: true },
  { cyr: 'D', lat: 'D', name: 'dé', ipa: 'd', hint: 'd, « dé »', exampleCyr: 'екі', exampleLat: 'eki', exampleFr: 'deux', core: true },
  { cyr: 'E', lat: 'E', name: 'e', ipa: 'ɑ̃', hint: 'en = мұрын жолды a, « enfant »', exampleCyr: 'бала', exampleLat: 'bala', exampleFr: 'enfant', core: true },
  { cyr: 'F', lat: 'F', name: 'effe', ipa: 'f', hint: 'f, « effe »', exampleCyr: 'отбасы', exampleLat: 'otbasy', exampleFr: 'famille', core: true },
  { cyr: 'G', lat: 'G', name: 'gé', ipa: 'g', hint: 'a, o, u алдында g қатты', exampleCyr: 'үлкен', exampleLat: 'ulken', exampleFr: 'grand', core: true },
  { cyr: 'H', lat: 'H', name: 'hache', ipa: '', hint: 'h көбіне үнсіз: hôtel = /otɛl/', exampleCyr: 'қонақүй', exampleLat: 'qonaqüi', exampleFr: 'hôtel', core: true },
  { cyr: 'I', lat: 'I', name: 'i', ipa: 'i', hint: 'i, « i »', exampleCyr: 'ол', exampleLat: 'ol', exampleFr: 'il', core: true },
  { cyr: 'J', lat: 'J', name: 'ji', ipa: 'ʒ', hint: 'ж сияқты', exampleCyr: 'күн', exampleLat: 'kün', exampleFr: 'jour', core: true },
  { cyr: 'K', lat: 'K', name: 'ka', ipa: 'k', hint: 'k, кірме сөздерде', exampleCyr: 'кило', exampleLat: 'kilo', exampleFr: 'kilo', core: true },
  { cyr: 'L', lat: 'L', name: 'elle', ipa: 'l', hint: 'l, « elle »', exampleCyr: 'сүт', exampleLat: 'süt', exampleFr: 'lait', core: true },
  { cyr: 'M', lat: 'M', name: 'emme', ipa: 'm', hint: 'm, « emme »', exampleCyr: 'ана', exampleLat: 'ana', exampleFr: 'mère', core: true },
  { cyr: 'N', lat: 'N', name: 'enne', ipa: 'n', hint: 'n, « enne »', exampleCyr: 'жоқ', exampleLat: 'joq', exampleFr: 'non', core: true },
  { cyr: 'O', lat: 'O', name: 'o', ipa: 'ɔ', hint: 'o, « orange »', exampleCyr: 'апельсин', exampleLat: 'apelsin', exampleFr: 'orange', core: true },
  { cyr: 'P', lat: 'P', name: 'pé', ipa: 'p', hint: 'p, « pé »', exampleCyr: 'нан', exampleLat: 'nan', exampleFr: 'pain', core: true },
  { cyr: 'Q', lat: 'Q', name: 'ku', ipa: 'k', hint: 'qu = k', exampleCyr: 'төрт', exampleLat: 'tört', exampleFr: 'quatre', core: true },
  { cyr: 'R', lat: 'R', name: 'erre', ipa: 'ʁ', hint: 'париж r, ғ-ға жақын', exampleCyr: 'қызыл', exampleLat: 'qyzyl', exampleFr: 'rouge', core: true },
  { cyr: 'S', lat: 'S', name: 'esse', ipa: 's', hint: 's, « esse »', exampleCyr: 'сәлем', exampleLat: 'sälem', exampleFr: 'salut', core: true },
  { cyr: 'T', lat: 'T', name: 'té', ipa: 't', hint: 't, « té » — thé = /te/', exampleCyr: 'шай', exampleLat: 'şai', exampleFr: 'thé', core: true },
  { cyr: 'U', lat: 'U', name: 'u', ipa: 'y', hint: 'ү сияқты, « une »', exampleCyr: 'бір', exampleLat: 'bir', exampleFr: 'une', core: true },
  { cyr: 'V', lat: 'V', name: 'vé', ipa: 'v', hint: 'v, « vé »', exampleCyr: 'қала', exampleLat: 'qala', exampleFr: 'ville', core: true },
  { cyr: 'W', lat: 'W', name: 'double vé', ipa: 'v', hint: 'французша көбіне v', exampleCyr: 'вагон', exampleLat: 'vagon', exampleFr: 'wagon', core: true },
  { cyr: 'X', lat: 'X', name: 'ixe', ipa: 'ks', hint: 'x = ks, « xylophone »', exampleCyr: 'ксилофон', exampleLat: 'ksilofon', exampleFr: 'xylophone', core: true },
  { cyr: 'Y', lat: 'Y', name: 'i grec', ipa: 'jø', hint: 'yeux = /jø/', exampleCyr: 'көз', exampleLat: 'köz', exampleFr: 'yeux', core: true },
  { cyr: 'Z', lat: 'Z', name: 'zède', ipa: 'z', hint: 'z, « zède »', exampleCyr: 'нөл', exampleLat: 'nöl', exampleFr: 'zéro', core: true },
  { cyr: 'É', lat: 'É', name: 'é', ipa: 'e', hint: 'é — жабық e, « été »', exampleCyr: 'жаз', exampleLat: 'jaz', exampleFr: 'été', core: false },
  { cyr: 'Ç', lat: 'Ç', name: 'cédille', ipa: 's', hint: 'ç әрқашан s, « ça »', exampleCyr: 'бұл', exampleLat: 'būl', exampleFr: 'ça', core: false },
]
