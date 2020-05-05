const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const keys = require('./config/key');
const Nexmo = require('nexmo');
// Load models
const Contact = require('./models/contact');
const Service = require('./models/service');
const Review = require('./models/review');
// initalize app
const app = express();
const {
    formatDate,
    getLastMinute,
    getYear
} = require('./helpers/time');
// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        formatDate: formatDate,
        getLastMinute: getLastMinute,
        getYear: getYear
    }
}));
app.set('view engine', 'handlebars');
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
// connect to MongoDB
mongoose.connect(keys.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB...');
}).catch((err) => {
    console.log(err);
});
const server = http.createServer(app);
// SOCKET CONNECTION AND NOTIFIER STARTS
const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('Connected to Client');

    // listen to new contact event
    socket.on('newContact', (newContact) => {
        console.log(newContact);
        new Contact(newContact).save((err, contact) => {
            if (err) {
                console.log(err);
            }
            if (contact) {
                console.log('Someone contacted us..');
            }
        });
    });
    // listen to serviceRequest event
    socket.on('serviceRequest', (newRequest) => {
        console.log(newRequest);
        const newServiceRequest = {
            name: newRequest.name,
            email: newRequest.email,
            number: newRequest.number,
            problem: newRequest.problem,
            service: newRequest.service,
            date: new Date()
        }
        new Service(newServiceRequest).save((err, service) => {
            if (err) {
                console.log(err);
            }
            if (service) {
                console.log('New Request received ..');
                // NEXMO
                const phone = parseInt(service.number);
                const nexmo = new Nexmo({
                    apiKey: keys.NextmoApiKey,
                    apiSecret: keys.NextmoApiSecret,
                });

                const from = 17034684937;
                const to = 12156881490;
                const text = `${service.service} has been requested from a following client:
              NAME: ${service.name}, EMAIL: ${service.email}, PHONE: ${phone}, 
              SUBJECT: ${service.subject}, REASON: ${service.problem}, SERVICE NEEDED: ${service.service}, 
              TIME: ${service.date}`;

                nexmo.message.sendSms(from, to, text);
            }
        });
    });
    // listen to newReview event
    socket.on('newReview',(newReview) => {
        console.log(newReview);
        new Review(newReview).save((err,review) => {
            if (err) {
                console.log(err);
            }
            if (review) {
                console.log('New Review received', newReview);
            }
        })
    });
    // send only 4 and 5 star review to client
    Review.find({$or: [{rating:4},{rating:5}]}).then((reviews) => {
        socket.emit('reviews',{reviews:reviews});
    }).catch((err) => {console.log(err)});
});
io.on('disconnection', () => {
    console.log('Disconnected from Client');
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
