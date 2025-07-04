const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
