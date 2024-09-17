import mongoose from 'mongoose'

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  verificationCode: {
    type: String
  },
  createdAt: { type: Date, default: Date.now, expires: 300 }
})

const verificationCode =
  mongoose.models.verificationCode ||
  mongoose.model('verificationCode', verificationCodeSchema)

export default verificationCode
