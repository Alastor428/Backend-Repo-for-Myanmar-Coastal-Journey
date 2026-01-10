const mongoose = require('mongoose');

mongoose.connect(
  `mongodb://localhost:27017/mydb`,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) {
      throw err;
    } else {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    }
  },
);

const db = async() => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            },

        )
        console.log('database connected',db.toString);
    } catch(error) {
        console.log('database connection error: ',error);
    }
};

module.exports = { db };