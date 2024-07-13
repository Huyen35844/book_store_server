import { connect } from 'mongoose'

const uri = 'mongodb://localhost:27017/book-store'
connect(uri).then(() => {
    console.log('db connected successfully');
}).catch((err) => {
    console.log('db connection error: ', err.message);
})


/**
 * sử dụng connect trong mongoose để kết nối {connect}
 * trong connect có uri (đường dẫn db)
 * sử dụng then catch, thông báo cho trường hợp thành công và thất bại
 */