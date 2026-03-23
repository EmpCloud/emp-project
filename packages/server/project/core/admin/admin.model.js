import mongoose, { STATES } from 'mongoose';
import uuidv1 from 'uuidv1';
import moment from 'moment';
//import { languagesShortCodes } from "../language/language.constants";

const adminSchema = new mongoose.Schema({
    firstName: { type: String, max: 20, required: true }, // Admin First Name required field
    lastName: { type: String, max: 15 }, // Admin Last name optional field
    userName: { type: String, trim: true, required: true }, // Admin UserName required field //TODO: No patterns where finalized
    profilePic: { type: String, default: null }, //Admin Profile Picture link
    password: { type: String, trim: true, required: true }, //Admin password required field //TODO: No patterns where finalized
    countryCode: { type: String }, //Admin country code of Phone number required filed example: for India +91
    phoneNumber: { type: String }, //Admin Phonenumber required field
    email: { type: String, required: true }, //Admin Email Identification,required field
    orgId: { type: String, max: 11, required: true }, //Admin organization Id required field,for fresh user own orgId can be added TODO: No patterns where finalized
    orgName: { type: String, required: true }, //Admin organization Name required field,for fresh user own orgName can be added TODO: No patterns where finalized
    address: { type: String, required: true }, // Admin adress details ,required field for communication
    city: { type: String }, // Admin city info,required field for future datacenter Mngment
    state: { type: String }, // Admin state info,required field for future datacenter Mngment
    country: { type: String, required: true }, // Admin county info,required field for future datacenter Mngment
    zipCode: { type: String, max: 6 }, // Admin zipcode info,required field for future datacenter Mngment
    empMonitorId: { type: String }, // Its optional field, if Admin is from EmpMonitor then value of this files is Id
    isEmpMonitorUser: { type: Boolean, default: false }, // To diff normal and EmpMonitor Admin this field is used by default it will be false
    lastUserFetched: { type: Date, default: null }, // To find the last user fetch details time if Admin is from EmpMonitor basically to restrict API hits
    isConfigSet: { type: Boolean, default: false }, //whether to check dynamic collection created or not
    isDasboardConfigSet:{ type: Boolean, default: false }, //whether to check dashboard config selected or no
    dashboardConfigData : [
        {
            dashboardConfig_id: { type: String, default: null }, //For identification of dashboard config id
            dashboardConfig: { type: Object, default: {} }, //For set the dashboard config
            
        },
    ],
    dashboardConfigCreatedAt: { type: Date }, //To find the created date of Dashboard config
    dashboardConfigUpdatedAt: { type: Date }, //To find the last updated time of Dashboard config
    verified: { type: Boolean, default: false }, //To verify the mail ,if its from the emp monitor it will true
    isAdmin: { type: Boolean, default: true }, //For Front End Model management
    isOverwrite: { type: Boolean, default: false },
    lastLogin: {type: Date,default:Date.now()},
    socialLogin: { type: Boolean, default: true }, //for social login 
    socialNetwork:  {type: Number}, //Google-1,FB-2,Twitter-3
    forgotPasswordToken: { type: String, default: uuidv1() }, //Token for handling the  forget password
    forgotTokenExpire: { type: Date, default: moment().add(1, 'day')?._d }, //Token expire for forget password
    passwordEmailSentCount: { type: Number, default: 0 }, //counter of email sent for password updation
    language: { type: String, default: 'en' }, // To update language
    planName: { type: String, default: 'Free' }, //admin selecting plan
    planStartDate: { type: Date, default: null }, //plan start date
    planExpireDate: { type: Date, default: null }, //plan end date
    planData:{type:Object,default:null},
    emailValidateToken: { type: String, default: uuidv1() }, //Token for verifying email
    emailTokenExpire: { type: Date, default: moment().add(1, 'day')?._d }, //Token expired after 1 day for mail verification
    verificationEmailSentCount: { type: Number, default: 0 }, //counter of verification email sent
    isSuspended:{ type: Boolean, default: false},
    isWorkForce :{type:Boolean,default:false},//true if Registered through A Member Login false if not Registered from A Member
    planDowngrade:{type:Boolean,default:false},//to check if downGraded Plan is Stable with Existing Data
    createdAt: { type: Date, default: Date.now() }, // Created Date and Time of Admin
    updatedAt: { type: Date, default: Date.now() }, // lastly updated Date and Time of Admin
});

export default mongoose.model('adminSchema', adminSchema);
