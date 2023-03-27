const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')


exports.getOverview = catchAsync( async(req, res,next) => {
  //get tour data from collection
  const tours = await Tour.find();

  // Build template
  // render that template by using the tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour= catchAsync(async (req, res,next) => {
  const slug = req.params.slug;
  const name = slug.split('-')
  const tourName = camelCase(name).join(' ')
  console.log(tourName)
  let tour = await Tour.find({name:tourName}).populate('reviews');
  
  tour = tour[0]
  console.log(tour.reviews)

  res.status(200).render('tour', {
    title: tour.name,
    tour
  })
})

const camelCase = (arr) =>{
  const temp =[];
  arr.forEach(word => {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    temp.push(word);
  });
  return temp;
}

exports.getLogin=catchAsync( async(req, res, next) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('login', {
      title: 'Login',
    });
});