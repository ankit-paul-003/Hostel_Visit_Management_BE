import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "teacher"],
        default: "teacher"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },
    
      isEmailVerified: {
        type: Boolean,
        default: false
      },

      // Used to invalidate previously issued JWTs (e.g., on logout)
      tokenVersion: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
);


const User = mongoose.model('User', userSchema);
export default User;