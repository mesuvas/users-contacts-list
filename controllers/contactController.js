const Contact = require("../models/contactModel")

const asyncHandler = require('express-async-handler')
//@desc Get all contacts
//@routes Get /api/contacts/
//@access private
const getContacts = asyncHandler (async (req, res) => {
  const contacts = await Contact.find({user_id: req.user.id})
  res.status(200).json({contacts});  
})

//@desc create a contact
//@routes post /api/contacts/
//@access private
const createContact = asyncHandler (async (req, res) => {
  console.log("The request body is : ", req.body);
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatoy !!!");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  }); 
  
  res.status(201).json(contact);
})

//@desc Get a single contact
//@routes Get /api/contacts/
//@access private
const getContact = asyncHandler (async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact){
    res.status(404);
    throw new Error("Contact not found.")
  }
  res.status(200).json(contact);
})
//@desc update a contact
//@routes put /api/contacts/
//@access private
const updateContact = asyncHandler (async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if(!contact)
  {
    res.status(404)
    throw new Error("Contact not found")
  }

  if(contact.id.toString() != req.user.id){
    res.status(403)
    throw new Error('User do not have permission to update')
  }
 
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  )
  res.status(200).json(updatedContact);
})

//@desc delete a contacts
//@routes delete /api/contacts/
//@access private
const deleteContact = asyncHandler (async(req, res) => {
 
  const contact = await Contact.findById(req.params.id)
  if(!contact){
    res.status(404)
    throw new Error("Contact not found")
  }

   if (contact.id.toString() != req.user.id) {
     res.status(403);
     throw new Error("User do not have permission to delete");
   }
  await contact.deleteOne();

  res.status(200).json(contact);
})

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
}