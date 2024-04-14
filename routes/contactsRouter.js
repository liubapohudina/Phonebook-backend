import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact
} from "../controllers/contactsControllers.js";
import { createContactSchema, updateContactSchema, updateContactSchemaStatus } from "../schemas/contactsSchemas.js";
import { validateBody } from "../helpers/validateBody.js";
import authenticate from "../midllewares/authenticate.js";
import isValidId from "../midllewares/isValidId.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);


contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", isValidId, validateBody(updateContactSchemaStatus), updateContact)

export default contactsRouter;