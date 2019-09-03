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
    }


    //to register new User
    createNewUser(newUser) {
        return UserModel
        .create(newUser)
    }


    checkUsername(usernameNeedCheck) {
        return UserModel
            .findOne({
                username: usernameNeedCheck
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


    updateTutorDataArray(tutorId, index, obj) {
        return UserModel
            .update(
                {_id: id},
                {$set: {'tutorData.education.$[index]': obj}}
                )
    }


    // createTutorDataArray()


    deleteTutorRefRow(index) {
        return UserModel
            .findByIdAndRemove()
    }
}

export default new UserService()