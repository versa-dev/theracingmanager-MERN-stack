module.exports = {
  horseCode: {
    type: String,
    required: true
  },
  horseName: {
    type: String,
    tf: 'horseName',
    uppercase: true,
    required: true
  },
  meetingDate: {
    type: String, tf: 'meetingDate'
  },
  curseId: {
    type: String
  },
  courseName: {
    type: String
  },
  courseId: {
    type: String
  },
  ispFractional: {
    type: String
  },
  ispFavText: {
    type: String
  },
  BSPAdvantage: {
    type: String
  },
  ipMax: {
    type: String
  },
  ipMin: {
    type: String
  },
  equipmentChar: {
    type: String
  },
  jockeyCode: {
    type: String
  },
  jockeyName: {
    type: String
  },
  performanceRating: {
    type: String
  },
  timefigure: {
    type: String
  },
  positionOfficial: {
    type: String
  },
  performanceCommentPremium: {
    type: String
  },
  raceNumber: {
    type: String
  },
  distanceBeaten: {
    type: String
  },
  ipSymbols: {
    type: String
  },
  performanceSymbol: {
    type: String
  },
  handicapMark: {
    type: String
  },
  distanceCumulative: {
    type: String
  },
  betfairPlaceSP: {
    type: String
  },
  betfairWinSP: {
    type: String
  },
  silkCode: {
    type: String
  },
  trainerName: {
    type: String
  },
  horseAge: {
    type: String
  },
  topRated: {
    type: String
  }
}
