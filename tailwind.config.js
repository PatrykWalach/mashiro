/* eslint-disable @typescript-eslint/no-var-requires*/
const colors = require('windicss/colors')

const typography = require('windicss/plugin/typography')

module.exports = {
  darkMode: 'class',
  plugins: [typography, require('windicss/plugin/forms')],
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
      },
    },
  },
}
