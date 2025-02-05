import { Novu } from "@novu/node"
import dotenv from "dotenv"
dotenv.config()

const novu = new Novu('2caefae1bc7475ecc229720ac4f8bc08')

export default novu