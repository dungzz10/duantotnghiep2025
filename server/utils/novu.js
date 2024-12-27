const { Novu } = require("@novu/node")
require("dotenv").config()

const novu = new Novu('2caefae1bc7475ecc229720ac4f8bc08')

module.exports = novu