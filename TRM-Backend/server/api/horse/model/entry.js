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
  topRated: {
    type: String
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
  raceNumber: {
    type: String
  },
  silkCode: {
    type: String
  },
  silkDescription: {
    type: String
  },
  courseId: {
    type: String
  },
  entryNumber: {
    type: String
  },
  formFigures: {
    type: String
  },
  jockeyName: {
    type: String
  },
  trainerName: {
    type: String
  },
  horseAge: {
    type: String
  },
  BHARating: {
    type: String
  }
}
