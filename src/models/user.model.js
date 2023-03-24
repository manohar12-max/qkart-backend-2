const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt= require("bcryptjs")

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      

    },
    email: {
      type:String,
      required:true,
      trim:true,
      unique:true,
      lowercase:true,
      validate(newvalue){
        if(validator.isEmail(newvalue)){
          return true
      }
      else{
        throw new Error("Invalid Email")
      }
      }
    },
    password: {
      type: String,
      required:true,
      trim:true,
      minLength:8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    
      
    },
    walletMoney: {
      type:Number,
      required:true,
      default:config.default_wallet_money,
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const user =await this.findOne({email}) // in static "this" refers to entire schema(User) overhere this refers to the userschema
                                         //hence this.findone is same as userschema.findone
  return !!user   
//   !! 0 –> false
// !! null –> false
// !! undefined –> false
// !! 48 –> true
// !! “hello” –> true
// !! [1, 2, 3] –> true                       
};

  

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS


/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user= this /// here this is refering to const user vala user
  return await bcrypt.compare(password,user.password) //sends true or false
};





/**
 * Check if user have set an address other than the default address
 * - should return true if user has set an address other than default address
 * - should return false if user's address is the default address
 *
 * @returns {Promise<boolean>}
 */
userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
   return user.address !== config.default_address;
};

/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */

const User =new mongoose.model("Users",userSchema)

module.exports.User = User
