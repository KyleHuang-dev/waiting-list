const Customer = require("../models/Customer");
const cloudinary = require("../middleware/cloudinary");

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
  createCustomer: async (req, res) => {
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
  // deletePost: async (req, res) => {
  //   try {
  //     // Find post by id
  //     let post = await Post.findById({ _id: req.params.id });
  //     // Delete image from cloudinary
  //     await cloudinary.uploader.destroy(post.cloudinaryId);
  //     // Delete post from db
  //     await Post.remove({ _id: req.params.id });
  //     console.log("Deleted Post");
  //     res.redirect("/profile");
  //   } catch (err) {
  //     res.redirect("/profile");
  //   }
  // },
};
