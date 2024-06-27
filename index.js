const express = require('express');
const bodyParser = require('body-parser');
const itemsRouter = require('./routes/items');
const orderRouter=require('./routes/orders')
const productRouter=require('./routes/product')
const userRouter=require('./routes/authRoute')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', itemsRouter);
app.use('/api', orderRouter);
app.use('/api',productRouter);
app.use('/api',userRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds
