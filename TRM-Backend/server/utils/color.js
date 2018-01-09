const colors = [
  '#FFF2C7',
  '#f78e1e',
  '#1fb259',
  '#ee2e23',
  '#b30337',
  '#542989',
  '#a0cced',
  '#004890',
  '#6db43e',
  '#b3a1cd',
  '#006351',
  '#e7e7e7',
  '#959ca1',
  '#0068b3',
  '#794440',
  '#12242f',
  '#fff352',
  '#fac8ca'
]
const getRandomColor = () => {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const getColor = () => (colors.pop() || getRandomColor())

module.exports = {
  getColor
}
