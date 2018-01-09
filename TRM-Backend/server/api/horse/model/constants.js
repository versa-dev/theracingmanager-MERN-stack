const OWNERSHIP_TYPE = [
  'Fixed Period',
  'Open Ended Period'
]

const RACING_TYPE = [
  'National Hunt',
  'Flat Racing',
  'Dual Purpose'
]

const RACING_HISTORY = [
  'Unraced',
  'Raced'
]

const STYLE = [
  'Jump',
  'Flat',
  'Dual Purpose'
]

const RACE_PLANS = {
  type: String,
  default: `The race plans for this filly will be determined by her level of ability shown at home and on the course in 2017. On breeding she is sprint bred, but she has already shown signs of stamina and we expect she could be running over a mile as a 3YO.
With this filly having already run enough times to qualify for nursery handicaps, she will continue in this vein through 2017 - eventually into full handicap company, or if she proves to be good enough, possibly better company. She showed at Chelmsford in November 2016 when finishing second on her handicap debut that she has ability and has progressed with every run to date.
This filly will be stabled in Lambourn, Berkshire throughout her 3YO career and will therefore be racing in the South at tracks such as Sandown, Windsor, Kempton, Lingfield, Newmarket, Ascot, Bath and others in the Midlands.
There are plenty of races available for her right from the start of the season. We will assess this filly’s progress and if Seamus believes she has the right level of ability she may get entries for some of the more prestigious handicap races in the racing calendar.
Your online Racehorse Manager will provide full details of all developments in terms of race planning as the season progresses.`
}

const HORSE_VALUE = {
  type: String,
  default: `We expect to get 3-6 runs and possibly more from this racehorse in her share period, however, you should expect periods of no racing as a result of recuperation from injury or training setbacks. This share period starts April 1st 2017 and runs through the summer turf season, finishing on November 1st 2017.
During the season the horse may be rested or have time away from the track to recover and it is quite normal for a racehorse to have periods of 3-6 weeks rest between races. Young horses are particularly susceptible to sore shins, bone chips and growing pains, and can need a greater time to recover between races.
For this filly we offer the following guarantee: If due to injury or retirement, this filly's season is cut short and will not race again, and she has not raced at least twice, we will replace her with a similar horse for the remainder of the 2017 turf season. Please note that we are unable to pay prizemoney on any replacements and the replacement will be a horse of our own choosing.
As a shareholder you must understand that we cannot guarantee your horses performance, a specific volume of runs (beyond our minimum guarantee) or that runs will be evenly spaced throughout the share period.
This is the chance you take when owning any racehorse and participating in this ownership experience. If you will be disappointed with only 2-3 runs from your racehorse during the season, then please DO NOT PARTICIPATE IN THIS OR ANY OTHER RACEHORSE.
We believe in being crystal clear with our shareholders - any participation in racehorse ownership is high risk, and we are unable to make any refunds because of share periods which finish early due to injury or retirement - as training and livery fees for the horse still remain whether they are racing or not. This is the chance all shareholders take, as we do ourselves, when participating in the ownership of a racehorse.`
}

const HORSE_CARD_FIELDS = [
  'thumbnailImage',
  'name',
  'age',
  'gender',
  'racingType',
  'performances',
  'trainer.name',
  'shares'
]

module.exports = {
  OWNERSHIP_TYPE,
  RACING_TYPE,
  RACING_HISTORY,
  STYLE,
  RACE_PLANS,
  HORSE_VALUE,
  HORSE_CARD_FIELDS
}
