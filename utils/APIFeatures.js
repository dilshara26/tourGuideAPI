class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    console.log(queryObj);
    //ADVANCED FILTERING
    // As we get the req.query, the price[lt]=1000 comes as {price: {'lt': 1000}} which should ideally come with a dollar sign to search in mongoDB. Therefore a regex has been used to replace the lt,gt,gte,lte with dollar sign
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      console.log('Sorted');
      this.query = this.query.sort(sortby);
      return this;
    } else {
      // query = query.sort('-createdAt');
      console.log('Unsorted');
      this.query = this.query;
      return this;
    }
  }
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
      return this;
    } else {
      this.query = this.query.select('-__v');
      return this;
    }
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }
    return this;
  }
}
module.exports = APIfeatures;
