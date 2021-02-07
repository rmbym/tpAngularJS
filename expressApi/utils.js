let User = require('./models/userModel');
let Operation = require('./models/operationModel');
let Mission = require('./models/missionModel');

async function authenticate(userObj,res) {
    // Works !!
    console.log('getting',userObj);
    const user = await getUser(userObj);
    if (user.length !== 0) {
        console.log(user[0]);
        try {
            res.status(200).json({
                    id: user[0]._id,
                surName: user[0].surName,
                firstName: user[0].firstName,
                userMail: user[0].userMail,
                userPwd: user[0].userPwd,
                isAuth: true
                });
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        console.log('err',user);
        try {
            res.status(200).json({
                id: "",
                surName: "",
                firstName: "",
                userMail: "",
                userPwd: "",
                isAuth: false
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

async function createNewUser(userObj,res) {
    const newUser = new User(userObj);
    try {
        await newUser.save(function(err, user) {
            if (err) {
                res.status(200).json({msg:"This email is already in use, please choose another one",opResult:"error"});
            } else {
                res.status(200).json({msg:"Your account has been created, please authenticate with your new credentials. username: "+userObj.userMail+", password: "+userObj.userPwd,opResult: "ok"});
            }
        });
    } catch (err) {
        res.status(403).send(err);
    }
};

async function getAllUsers(req,res) {
    const users = await User.find({});
    try {
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
};

async function getUser(userObj) {
    const user = await User.find(userObj);
    return user;
};

async function createOperation(operationObj,res) {
    const newOp = new Operation(operationObj);
    console.log("oP",newOp);
    try {
        await newOp.save(function(err) {
            if (err) {
                res.status(200).json({msg:"Could not create new Operation",opResult:"error"});
            } else {
                 addToMission(newOp,res);
                //res.status(200).json({msg:"New operation created",opResult: "ok"});
            }
        });
    }catch (err) {
        res.status(500).send(err);
    }
};

async function addToMission(opObj,res) {
    try {
        await Mission.findOneAndUpdate({name:opObj.missionName}, {$push: {operations: opObj}},
            {new: true})
            .populate('operations')
            .exec(function (err,doc) {
                if (err) {
                    res.status(200).json({msg:"Could not add to mission",opResult:"error"});
                } else {
                    var finalResult = doc;
                    console.log('populated',finalResult);
                    const dup = finalResult.operations;
                    finalResult.operations = [...new Set(dup)];
                    res.status(200).json({msg:finalResult,opResult: "ok"});
                }
            });

    }
    catch (err) {
        res.status(500).send(err);
    }
}

async function deleteOps(opObj,res) {
    try {
        await Mission.findOneAndUpdate({name: opObj.missionName}, {$pull: {operations: opObj._id}},
            {new: true})
            .populate('operations')
            .exec(function (err,doc) {
                if (err) {
                    res.status(200).json({msg:"Could not remove from mission",opResult:"error"});
                } else {
                    var finalResult = doc;
                    console.log('populated',finalResult);
                    const dup = finalResult.operations;
                    finalResult.operations = [...new Set(dup)];
                    res.status(200).json({msg:finalResult,opResult: "ok"});
                }
            });
    }
    catch (err) {
        res.status(500).send(err);
    }
    /*try {
        await Mission.findOneAndUpdate({name: opObj.missionName}, {$pull: {operations: opObj._id}},
            {},function (err) {
                if (err) {
                    res.status(200).json({msg:"Could not remove from mission",opResult:"error"});
                } else {
                    res.status(200).json({msg:"Removed from mission",opResult: "ok"});
                }
            });
    }
    catch (err) {
        res.status(500).send(err);
    }*/
}

async function createMission(missionObj,res) {
    const newMission = new Mission(missionObj); //faut dab sauvegarder des operations ou pas d'ailleurs
    try {
        await newMission.save(function(err) {
            if (err) {
                res.status(200).json({msg:"Could not create new mission",opResult:"error"});
            } else {
                res.status(200).json({msg:"New mission created",opResult: "ok"});
            }
        });
    }catch (err) {
        res.status(500).send(err);
    }
}

async function getOps(missionName,res) {
    const mission = await Mission.find({name: missionName});
    const result = mission[0].operations.filter((v, i, a) => a.indexOf(v) === i);
    console.log(result);
    try {
        res.status(200).json(result);
    } catch (err) {
        console.log("err");
        res.status(500).send(err);
    }
}

async function getMission(employeeMail,res) {
    if (employeeMail !== "") {
        const mission = await Mission.find({employeesMail:employeeMail}).populate('operations');
        console.log("retrieved", mission);
        if (mission[0] !== undefined){
            const duplicates = mission[0].operations;
            mission[0].operations = [...new Set(duplicates)];
            try {
                res.status(200).json(mission[0]);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(204).send();
        }
    } else {
        res.status(500).send();
    }
}

module.exports = {authenticate,createNewUser,getAllUsers,createMission,createOperation,getOps,getMission,deleteOps};