import UserModel from '../models/userModel';
import * as path from 'path';


class UserService {
	getAllUser() {
        return UserModel
            .find({})
    }
    

    getAllTutor() {
        return UserModel
            .find({
                rolesId: 'Tutor'
            })
            .select('username avatar firstName lastName tutorData')
    }
    

    getUserById(id){
        return UserModel
            .findOne({
                _id: id
            })
    }


    findOneUser(){
        return UserModel
            .findOne({})
    }

    
    checkTutor(id){
        return UserModel
            .findOne({
                _id: id,                
                rolesId: 'Tutor'
            })
            .select('username profilePicture tutorData')
    }


    //to register new User
    createNewUser(newUser) {
        return UserModel
        .create(newUser)
    }


    checkUsername(value) {
        return UserModel
            .findOne({
                username: value
            })
    }

    
    deleteUser(id) {
        return UserModel
            .update(
                {_id: id},
                {active: false}
            )
            .exec()
    }


    //avatar
    updateAvatarPath(id, path) {
        return UserModel
            .update(
                {_id: id},
                {avatar: path}
            )
    }


    findByKeyWord(value) {
        return UserModel
            .find(
                {value}
            )
    }


    updateTutorDataArray(tutorId, obj) {
        return UserModel
            .update(
                {_id: id},
                {$set: {'tutorData.education': obj}},
                {new: true}
                )
    }


    // createTutorDataArray()


    deleteTutorRefRow(index) {
        return UserModel
            .findByIdAndRemove()
    }
}

export default new UserService()