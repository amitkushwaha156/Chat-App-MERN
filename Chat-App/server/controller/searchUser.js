const UserModel=require('../models/UserModel')
async function searchUser(req, res) {
    try {
        const {search}=req.body;

        const query=new RegExp(search,"i","g")

        const user=await UserModel.find({
            $or:[
                {name:query},
                {email:query}
            ]
        })
        res.status(200).json({
            message:"All User Search",
            data:user,
            success:true
        })
       
        
    } catch (error) {
        
    }


}

module.exports=searchUser;