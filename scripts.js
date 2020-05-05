// code written by eldor togaymurotov more visit at www.eldor.io
jQuery(document).ready(function(){
  var socket = io();
  socket.on('connect',function(socket){
    console.log('Connected to Server');
  });
  // Contact Form Submit
  var contactBTN = jQuery('#contact-btn');
  var contactForm = jQuery('#contactForm');
  var successMSG = jQuery('#success-msg');
  contactBTN.on('click', function(){
    var name = jQuery('#name').val();
    var email = jQuery('#email').val();
    var subject = jQuery('#subject').val();
    var message = jQuery('#message').val();
    const newContact = {
      name: name,
      email: email,
      subject: subject,
      message: message,
      date: new Date()
    };
    socket.emit('newContact', newContact);
    contactForm.attr('style','display:none');
    successMSG.attr('style','display:block');
  });
  // fetch request form data
  var serviceBTN = jQuery('#service-btn');
  serviceBTN.on('click', function(){
    var name = jQuery('#client-name').val();
    var email = jQuery('#client-email').val();
    var number = jQuery('#client-number').val();
    var subject = jQuery('#client-subject').val();
    var problem = jQuery('#client-problem').val();
    var service = jQuery('#typeofservice').val();
    var newRequest = {
      name:name,
      email:email,
      number:number,
      subject:subject,
      problem:problem,
      service:service,
      date: new Date()
    }
    socket.emit('serviceRequest',newRequest);
    var serviceMSG = jQuery('#service-msg');
    var serviceForm = jQuery('#serviceForm');
    serviceMSG.attr('style','display:block');
    serviceForm.attr('style','display:none');
  });
  // display review form
  var reviewDisplayer = jQuery('#review-btn');
  reviewDisplayer.on('click',function(){
    var reviewContainer = jQuery('#testimonial');
    reviewContainer.attr('style','display:none');
    var reviewForm = jQuery('#review-form');
    reviewForm.attr('style','display:block');
  });
  // star fillup function
  var star1 = jQuery('#star1');
  var star2 = jQuery('#star2');
  var star3 = jQuery('#star3');
  var star4 = jQuery('#star4');
  var star5 = jQuery('#star5');
  star1.on('click',function(){
    var star1 = jQuery('#star1');
    var star2 = jQuery('#star2');
    var star3 = jQuery('#star3');
    var star4 = jQuery('#star4');
    var star5 = jQuery('#star5');
    if (star1.hasClass('checked')) {
      //star1.removeClass('checked');
      star2.removeClass("checked");
      star3.removeClass('checked');
      star4.removeClass('checked');
      star5.removeClass('checked');
    } else {
      star1.addClass('checked');
    }
  });
  star2.on('click', function () {
    var star1 = jQuery('#star1');
    var star2 = jQuery('#star2');
    var star3 = jQuery('#star3');
    var star4 = jQuery('#star4');
    var star5 = jQuery('#star5');
    if (star2.hasClass('checked')) {
      star2.removeClass("checked");
      star3.removeClass('checked');
      star4.removeClass('checked');
      star5.removeClass('checked');
    } else {
      star1.addClass('checked');
      star2.addClass("checked");
    }
  });
  star3.on('click', function () {
   var star1 = jQuery('#star1');
   var star2 = jQuery('#star2');
    var star3 = jQuery('#star3');
    var star4 = jQuery('#star4');
    var star5 = jQuery('#star5');
    if (star3.hasClass('checked')) {
      star3.removeClass('checked');
      star4.removeClass('checked');
      star5.removeClass('checked');
    } else {
      star1.addClass('checked');
      star2.addClass("checked");
      star3.addClass('checked');
    }
  });
  star4.on('click', function () {
    var star1 = jQuery('#star1');
    var star2 = jQuery('#star2');
    var star3 = jQuery('#star3');
    var star4 = jQuery('#star4');
    var star5 = jQuery('#star5');
    if (star4.hasClass('checked')) {
      star4.removeClass('checked');
      star5.removeClass('checked');
    } else {
      star1.addClass('checked');
      star2.addClass("checked");
      star3.addClass('checked');
      star4.addClass('checked');
    }
  });
   star5.on('click', function () {
     var star1 = jQuery('#star1');
     var star2 = jQuery('#star2');
     var star3 = jQuery('#star3');
     var star4 = jQuery('#star4');
     var star5 = jQuery('#star5');
     if (star5.hasClass('checked')) {
       star5.removeClass('checked');
     } else {
       star1.addClass('checked');
       star2.addClass("checked");
       star3.addClass('checked');
       star4.addClass('checked');
       star5.addClass('checked');
     }
   });
   // fetch review data
  var reviewBtn = jQuery('#review-post-btn');
  reviewBtn.on('click',function(){
    var errorTag = jQuery('#error');
    if(jQuery('#review-name').val() == ''){
      errorTag.text('Please type your name!');
    }
    if (jQuery('#review-email').val() == '') {
      errorTag.text('Email address is required!');
    }
    if (jQuery('#review').val() == '') {
      errorTag.text('Write your review!');
    }
    else{
      var reviewUser = jQuery('#review-name').val();
      var reviewUserEmail = jQuery('#review-email').val();
      var review = jQuery('#review').val();
      var reviewRating;
      var star1 = jQuery('#star1');
      var star2 = jQuery('#star2');
      var star3 = jQuery('#star3');
      var star4 = jQuery('#star4');
      var star5 = jQuery('#star5');
      if (star1.hasClass('checked')) {
        console.log('1 star');
        reviewRating = 1;
      }
      if (star2.hasClass('checked')) {
        console.log('2 star');
        reviewRating = 2;
      }
      if (star3.hasClass('checked')) {
        console.log('3 star');
        reviewRating = 3;
      }
      if (star4.hasClass('checked')) {
        console.log('4 star');
        reviewRating = 4;
      }
      if (star5.hasClass('checked')) {
        console.log('5 star');
        reviewRating = 5;
      } else {
        console.log('No review');
      }

      const newReview = {
        reviewUser: reviewUser,
        reviewUserEmail: reviewUserEmail,
        rating: reviewRating,
        review: review,
        date: new Date()
      }
      socket.emit('newReview', newReview);
      var reviewContainer = jQuery('#testimonial');
      reviewContainer.attr('style', 'display:block');
      var reviewForm = jQuery('#review-form');
      reviewForm.attr('style', 'display:none');
      var reviewAlert = jQuery('#reviewAlert');
      reviewAlert.text('Thank you for your review!');
    }
  });
  // listen to reviews event
  socket.on('reviews',function(reviews){
    console.log('4-5 star reviews are ', reviews);
    reviews.reviews.forEach(function(review){
       console.log(review);
       // find main review container
       var reviewUsersContainer = jQuery('#review-users');
       // create div for single testimonial
       var singleTestimonial = jQuery('<div></div>');
       singleTestimonial.addClass('single-testimonial text-center');
       // create children elements
       var reviewPage = jQuery('<p></p>');
       reviewPage.text(review.review);
       var span1 = jQuery('<span></span>');
       span1.addClass('fa fa-star checked');
       var span2 = jQuery('<span></span>');
       span2.addClass('fa fa-star checked');
       var span3 = jQuery('<span></span>');
       span3.addClass('fa fa-star checked');
       var span4 = jQuery('<span></span>');
       span4.addClass('fa fa-star checked');
       var span5 = jQuery('<span></span>');
       span5.addClass('fa fa-star checked');
       var reviewUser = jQuery('<h2></h2>');
       reviewUser.text(review.reviewUser);
       var whoIsThis = jQuery('<h3></h3>');
       whoIsThis.text('Customer');
       // append children elements to parent
       singleTestimonial.append(reviewPage);
       singleTestimonial.append(span1);
       singleTestimonial.append(span2);
       singleTestimonial.append(span3);
       singleTestimonial.append(span4);
       singleTestimonial.append(span5);
       singleTestimonial.append(reviewUser);
       singleTestimonial.append(whoIsThis);
       reviewUsersContainer.append(singleTestimonial);
    });

  });
  // disconnection event
  socket.on('disconnect',function(){
    console.log('Disconnected from Server');
  });
});
