import { connect } from 'mongoose'

const uri = 'mongodb://localhost:27017/book-store'

connect(uri).then(() => {
    console.log('db connected successfully');
}).catch((err) => {
    console.log('db connection error: ', err.message);
})
