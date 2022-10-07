const Customer = require("../models/Customer");
const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");

module.exports = {
  getWaitingList: async (req, res) => {
    try {
      const waitingList = await Customer.find({waiting:true}).sort({ editedAt: "desc" }).lean();
      res.render("waitingList.ejs", { waitingList : waitingList, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getCustomer: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.render("customer.ejs", { customer : customer});
    } catch (err) {
      console.log(err);
    }
  },
  getPhoneBook: async (req, res) => {
    try {
      const customers = await Customer.find().sort({ editedAt: "desc" }).lean();
      res.render("phoneBook.ejs", { customers: customers });
    } catch (err) {
      console.log(err);
    }
  },
  createCustomer: async (req, res) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.phoneNumber) || validator.isEmpty(req.body.name))
      validationErrors.push({msg: "Please enter customer name and phone number."});
    else if (!validator.isNumeric(req.body.phoneNumber) || !validator.isLength(req.body.phoneNumber, { min: 10 }))
      validationErrors.push({ msg: "Please enter a valid 10 digtals phone number." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/waitingList");
    }

    try {
      await Customer.create({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        vip: false,
        waiting : true,
        track: 0,
        editedAt: Date.now(),
      });
      console.log("Customer has been added!");
      res.redirect("/waitingList");
    } catch (err) {
      console.log(err);
    }
    
  },  
    updateCustomer: async (req, res) => {
      if(!req.file){
        try {
          console.log(req.body)
          await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
              name: req.body.name,
              note: req.body.note,
            }
          );
          console.log("Update customer profile");
          res.redirect(`/waitingList`);
        } catch (err) {
          console.log(err);
        }
      }else{
        try {
          
          // Find post by id
          let customer = await Customer.findById({ _id: req.params.id });
          if (customer.cloudinaryId)
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(customer.cloudinaryId);
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
          
          await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
              name: req.body.name,
              image: result.secure_url,
              cloudinaryId: result.public_id,
              note: req.body.note,
            }
          );
          console.log("Update customer profile");
          res.redirect(`/waitingList`);
        } catch (err) {
          console.log(err);
        }
     }
    },  
    sendMessage: async(req, res) => {
      try {
        let customer = await Customer.findById({ _id: req.params.id });
        const customerPhoneNum = customer.phoneNumber;
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const senderNumber = process.env.TWILIO_SENDER_NUMBER;
        const client = require('twilio')(accountSid, authToken);
      
      client.messages
        .create({
           body: 'Your Table is ready. Thanks!',
           from: senderNumber,
           to: "+1" + customerPhoneNum,
         })
        // .then(message => console.log(message.sid));
        res.redirect(`/waitingList`);
      }catch (err) {
        console.log(err);
      }

      
    },
    removeFromList: async (req, res) => {
        try {
          await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
              waiting:false,
            }
          );
          console.log("Remove from list");
          res.redirect(`/waitingList`);
        } catch (err) {
          console.log(err);
        }
      },
      addToList: async (req, res) => {
        try {
          await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
              waiting:true,
              editedAt:Date.now(),
            }
          );
          console.log("Remove from list");
          res.redirect(`/waitingList`);
        } catch (err) {
          console.log(err);
        }
      },
  // likePost: async (req, res) => {
  //   try {
  //     await Post.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     );
  //     console.log("Likes +1");
  //     res.redirect(`/post/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  deleteCustomer: async (req, res) => {
    try {
      // Find post by id
      let customer = await Customer.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(customer.cloudinaryId);
      // Delete post from db
      await Customer.remove({ _id: req.params.id });
      console.log("Deleted Customer");
      res.redirect("/phoneBook");
    } catch (err) {
      res.redirect("/phoneBook");
    }
  },
};
