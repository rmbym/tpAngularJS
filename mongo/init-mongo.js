db.createUser({
    user: "yannick",
    pwd: "mymdp",
    roles: [{
        role: "readWrite",
        db: "tpDatabase"
    }]
});