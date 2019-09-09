import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as bcrypt from 'bcryptjs';


const userModel = new Schema({
    username: {type: String, require: true, unique: true},
    email: {
        type: String, 
        require: true, 
        unique: true, 
        validate: {
            validator: function(value) {
                const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(value);
            },
            message: "{VALUE} is not a valid email address!"
        }
    },
    password: {type: String, require: true},
    rolesId: {type: String, enum:['Tutor','Student'], require: true},

    profilePicture: {type: Schema.Types.ObjectId, ref: 'avatar'},
    firstName: {type: String, default: null},
    lastName: {type: String, default: null},
    otherName: {type: String, default: null},
    gender: {type: String, enum: ['Male', 'Female', 'Others']},
    address: {type: String},
    city: {type: String},
    country: {type: String},
    religion: {type: String},
    raceName: {type: String},
    nationality: {type: String},
    dateOfBirth: {type: Date},
    currentEducationLevel: {type: String},
    language: {type: String},
    active: {type: Boolean, default: true},
    avatar: {type: String},

    /** tutor Infomations */
    tutorData: {
        /** tutor Reference*/
        hourlyRate: {type: Number},
        aboutMe: {type: String},
        education: [{
            major: {type: String},
            institute: {type: String},
            certificate: {type: String}
        }],

        /** working experience */
        workingExperience: [{
            year: {type: String},
            experience: {type: String},
            description: {type: String}
        }],

        /** teaching subject*/
        basedIn: {type: String},
        teachingSubject: [{
            course: {type: String},
            feePerHour: {type: Number},
            academicLevel: {type: String, enum: ['Beginner', 'Intensive', 'Advanced']},
            note: {type: String}
        }],

        /** tutor free time */
        periodeStart: {type: Date},
        periodeEnd: {type: Date},
        hourStart: {type: Number},
        hourEnd: {type: Number}
    }
},{
    timestamps: true
})


userModel.pre('save', function(next){
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt
        .genSalt(12)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => next(err))
})


module.exports = mongoose.model('user', userModel);