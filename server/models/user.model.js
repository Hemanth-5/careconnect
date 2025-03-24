import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const contactSchema = new mongoose.Schema({
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        // Only require password during regular operation, not during password reset
        return !this.passwordResetToken;
      },
    },
    fullname: { type: String },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      default: "prefer not to say",
    },
    dateOfBirth: { type: Date },
    age: { type: Number },
    profilePicture: { type: String },
    profilePicturePublicId: { type: String },
    contact: contactSchema,
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

// Add password hashing middleware if not already present
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Add password comparison method if not already present
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour

  return resetToken;
};

// Verify if reset token is valid
userSchema.methods.isPasswordResetTokenValid = function () {
  return this.passwordResetExpires > Date.now();
};

export default mongoose.model("User", userSchema);
