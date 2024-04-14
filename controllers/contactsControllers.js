import { listContacts, listContactsCount, addContact, getContactById, removeContact, updateCont } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";


export const getAllContacts = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { page = 1, limit = 20, favorite } = req.query;
        const skip = (page - 1) * limit;
        let filter = { owner }
        if (favorite && favorite === 'true') {
            filter.favorite = true;
        }
        const allContacts = await listContacts(filter, { skip, limit });
        const totalcount = await listContactsCount(filter);
        res.json({ allContacts, total: totalcount });
    } catch (error) {
        next(error);
    }
};

export const getOneContact =  async(req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const result = await getContactById({owner, _id: id });
        if (!result) {
            throw HttpError('404', "Not found")
        }
        res.json(result);
    } catch (error) {
        next(error);
    }

};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const result = await removeContact({owner, _id: id});
        if (!result) {
            throw HttpError('404', "Not found");
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
       
        const result = await addContact({ ...req.body, owner });
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const { id } = req.params;
        if (Object.keys(req.body).length === 0) {
            throw HttpError('400', "Body must have at least one field")
        }
        const result = await updateCont({owner, _id: id}, req.body, {new: true});
         if (!result) {
            throw HttpError('404', "Not found");
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

