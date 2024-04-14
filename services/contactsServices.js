
import Contact from '../models/Contacts.js';

export const listContacts = (filter, setting) => Contact.find(filter, null, setting).populate("owner", "email");
export const listContactsCount = filter => Contact.countDocuments(filter);
export const addContact = data => Contact.create(data);
export const getContactById = filter => Contact.findOne(filter);

export const removeContact = filter => Contact.findOneAndDelete(filter);
export const updateCont = (filter, data) => Contact.findOneAndUpdate(filter, data, {new: true});

