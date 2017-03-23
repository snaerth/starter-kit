import mongoose, {
  Schema
} from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import Promise from 'bluebird';

// Let mongoose use bluebird promises
// because mongoose promise library is deprecated
mongoose.Promise = Promise;

const schema = {
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: Array,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  thumbnailUrl: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date
  },
  facebook: {
    type: Object,
    required: false
  }
};

// Define user model
const userSchema = new Schema(schema);

// On save, encrypt password Before saving user model, run this function
userSchema.pre('save', function (next) {
  const user = this;

  // Generate a salt
  bcrypt.genSalt(10, (error, salt) => {
    if (error)
      return next(error);

    // Encrypt our password using the salt above
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error)
        return next(error);

      // Override plain password with encrypted password
      user.password = hash;
      return next(user);
    });
  });
});

// Compare password to encrypted password
userSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
      if (error) {
        return reject(error);
      }
      
      return resolve(isMatch);
    });
  });

};

export default mongoose.model('user', userSchema);