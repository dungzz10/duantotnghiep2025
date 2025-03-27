import express from "express";
import { checkPermission } from "../middlewares/CheckPermission.js";
import { createContact, getAllContact, getOneContact, removeContact, updateContact } from "../controllers/contact.js";
import { isAuththenticated } from "../middlewares/auth.js";
const RouterContact = express.Router();

RouterContact.get("/", getAllContact);
RouterContact.get("/:id", getOneContact);
RouterContact.post("/create", createContact);
RouterContact.put("/:id/edit",isAuththenticated, updateContact);
RouterContact.delete("/:id/delete",isAuththenticated, removeContact);

export default RouterContact; 