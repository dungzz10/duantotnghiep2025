import express from "express";
import { checkPermission } from "../middlewares/CheckPermission.js";
import { createContact, getAllContact, getOneContact, removeContact, updateContact } from "../controllers/contact.js";
const RouterContact = express.Router();

RouterContact.get("/", getAllContact);
RouterContact.get("/:id", getOneContact);
RouterContact.post("/create", createContact);
RouterContact.put("/:id/edit",checkPermission, updateContact);
RouterContact.delete("/:id/delete",checkPermission, removeContact);

export default RouterContact; 