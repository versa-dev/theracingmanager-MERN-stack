const PRIMARY_COLOR = [
  'BLANCHED ALMOND',
  'LEMON YELLOW',
  'BUBBLE GUM',
  'CARROT ORANGE',
  'MEDIUM TUSCAN RED',
  'RED PIGMENT',
  'CRIMSON GLORY',
  'LIGHT PASTEL PURPLE',
  'KSU PURPLE',
  'BABY BLUE EYES',
  'HONOLULU BLUE',
  'USAFA BLUE',
  'GREEN RYB',
  'GREEN CRAYOLA',
  'BOTTLE GREEN',
  'PLATINUM',
  'MANATEE',
  'DARK GUNMETAL'
]

const AVAILABILITY = {
  type: String,
  default: `This syndicate aims to offer a unique taste of racehorse ownership. Regular communication ensures that you are kept fully up-to-date with all the latest news.
Pro rata prize money share
Pro rata share of resale proceeds
Regular yard visits
Personalised messages and clips from the team
Live content from the races`
}

const DESCRIPTION = {
  type: String,
  default: `This syndicate specialises in putting together small groups of people to share in a number of top quality racehorses. This enables people to own a share in a racehorse and to enjoy racing at the highest level without the very high costs normally associated with owning racehorses. Perhaps even more crucially, it gives our shareowners a significantly greater chance of success. Indeed, since its creation in 1992, twenty seven per cent of Highclere’s syndicates have produced Black Type performers (Group 1, 2, 3 and Listed races), making Highclere the most successful multiple ownership company in Europe A large part of our success has been due to the selection process employed for purchasing yearlings. Since 1992 John Warren has purchased all of Highclere’s yearlings. John is one of the most talented and highly respected horsemen in the world, and has bought us a staggering seven champions in Lake Coniston, Tamarisk, Delilah, Petrushka, Motivator (the Royal Ascot Racing Club’s winner of the 2005 Group 1 Vodafone Derby), Memory (ROA Champion two-year-old Filly) and Harbinger.`
}

const BENEFITS = {
  type: String,
  default: `The race plans for this filly will be determined by her level of ability shown at home and on the course in 2017. On breeding she is sprint bred, but she has already shown signs of stamina and we expect she could be running over a mile as a 3YO.
With this filly having already run enough times to qualify for nursery handicaps, she will continue in this vein through 2017 - eventually into full handicap company, or if she proves to be good enough, possibly better company. She showed at Chelmsford in November 2016 when finishing second on her handicap debut that she has ability and has progressed with every run to date.
This filly will be stabled in Lambourn, Berkshire throughout her 3YO career and will therefore be racing in the South at tracks such as Sandown, Windsor, Kempton, Lingfield, Newmarket, Ascot, Bath and others in the Midlands.
There are plenty of races available for her right from the start of the season. We will assess this filly’s progress and if Seamus believes she has the right level of ability she may get entries for some of the more prestigious handicap races in the racing calendar.
Your online Racehorse Manager will provide full details of all developments in terms of race planning as the season progresses.`
}

const HERITAGE = {
  type: String,
  default: `In the course of running Highclere, we have had the great fortune of running our horses across the country, winning multiple trophies with a fantastic team. We measure our success, not only on the performance of our horses, but equally through the enjoyment and experience we deliver to our owners.`
}

const TRAINERS_HEADLINE = {
  type: String,
  default: `DELIVERING THE HIGHEST LEVEL OF PERSONAL SERVICE`
}

const TRAINERS_TEXT = {
  type: String,
  default: `This syndicate employs a selection of top racehorse trainers in each syndicate based in different areas of the country. This reduces the risk of an equine virus being a threat to any one syndicate and gives owners the chance of being involved with different leading stables.`
}

const HORSES_HEADLINE = {
  type: String,
  default: `EUROPE'S LEADING RACEHORSE OWNERSHIP COMPANY`
}

const HORSES_TEXT = {
  type: String,
  default: `We have a fantastic yard of horses, all of which have run competitively and placed with great confidence. Having managed race horses for many years now, we know where quality can be found and how to thoroughly enjoy the iniafull extent of the racing experience.`
}

module.exports = {
  PRIMARY_COLOR,
  DESCRIPTION,
  AVAILABILITY,
  BENEFITS,
  HERITAGE,
  TRAINERS_HEADLINE,
  TRAINERS_TEXT,
  HORSES_HEADLINE,
  HORSES_TEXT
}
