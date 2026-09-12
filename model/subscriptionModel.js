// models/Subscription.js
import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  name :{
    type : String,
    required : [true,"Must Enter a name"],
    trim : true,
    minLength :3,
    maxLength:50,
  },
  price : {
    type : Number,
    required : [true,"Must Enter a name"],
    min : [0,"The value shouldn't be lower than 0"],
    max : [1000,"The values are not greater than 1000"]
  },
 currency :{
    type : String,
    required : [true,"You must select a Currency"],
    enum : ["AFN","USD","RIL","EUR","GBP"],
    default:"AFN"
  },
  frequncy : {
     type : String,
     enum : ["Daily","Weekly ","Monthly","Yearly "],

  },
  category:{
    type : String,
    enum:["Bussnies","Sport","News","Lessons","Movies","other"],
    required:true,

  },
paymentMethod:{
  type: String,
  required:true,
  trim:true,
},
status:{
  type:String,
  enum:["active","cancelld","Expired"],
  default:"active"
},
startDate:{
  type : String,
  required:true,
  validator: (values)=> values <= new Date(),
    message : "Your start date must be in the past",
},
renewalDate:{
  type : String,
  required:true,
  validator: function (value){
    return value > this.startDate;
  },
    message : "Your start date must be in the past",
},
user:{
  type : mongoose.Schema.Types.ObjectId,
  ref : "User",
  required:true,
  index:true,        
}
},{timestamps:true})


// SubscriptionSchema.pre("save", function(next) {
//   const renewalPeriod = {
//     daily: 1,
//     weekly: 7,
//     monthly: 1,    // Use months instead of days
//     yearly: 12     // Use months instead of days
//   };

//   // Set initial renewal date or calculate next renewal
//   if (!this.renewalDate || this.isModified('startDate') || this.isModified('frequency')) {
//     this.renewalDate = new Date(this.startDate);
    
//     if (this.frequency === 'monthly' || this.frequency === 'yearly') {
//       // Use setMonth for proper month/year handling
//       const monthsToAdd = this.frequency === 'monthly' ? 1 : 12;
//       this.renewalDate.setMonth(this.renewalDate.getMonth() + monthsToAdd);
//     } else {
//       // For daily/weekly, use days
//       const daysToAdd = renewalPeriod[this.frequency];
//       this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
//     }
//   }

//   // Check if subscription has expired
//   if (this.renewalDate < new Date()) {
//     this.status = "expired";
//   } else {
//     this.status = "active";
//   }

//   next();
// });

const Subscription =  mongoose.model("Subscription",SubscriptionSchema)


export default Subscription