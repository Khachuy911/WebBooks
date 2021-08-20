const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.URL_MONGOOSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`Connect database successfully`);
  } catch (error) {
    console.log(`Connect database fail !!`);
  }
}

module.exports = connect;
