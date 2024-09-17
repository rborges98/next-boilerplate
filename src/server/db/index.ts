import mongoose from 'mongoose'

const MONGODB_URI =
  'mongodb+srv://admin:admin@teste.wiajo.mongodb.net/?retryWrites=true&w=majority&appName=Teste'

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI')
}

// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

async function connectToDatabase() {
  // if (cached.conn) {
  //   return cached.conn
  // }

  // if (!cached.promise) {
  //   cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
  //     return mongoose
  //   })
  // }

  // cached.conn = await cached.promise
  // return cached.conn
  return await mongoose.connect(MONGODB_URI)
}

export default connectToDatabase
