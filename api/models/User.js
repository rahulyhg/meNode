module.exports = {
    findorcreate: function (data, callback) {
        var orfunc = {};
        var insertdata = {};
        if (data.provider == "Facebook") {
            insertdata.fbid = data.id;
            insertdata.provider = data.provider;
            insertdata.username = data.username;
            insertdata.name = data.displayName;
            if (data.photos && data.photos[0]) {
                insertdata.profilepic = data.photos[0].value;
            }
            if (data.emails && data.emails[0]) {
                insertdata.email = data.emails[0].value;
            }
            insertdata.accessToken = data.accessToken;
            insertdata.refreshToken = data.refreshToken;
            orfunc.fbid = data.id;
            dbcall(insertdata);
        } else if (data.provider == "Google") {
            insertdata.googleid = data.id;
            insertdata.provider = data.provider;
            insertdata.name = data.displayName;
            if (data.photos && data.photos[0]) {
                insertdata.profilepic = data.photos[0].value;
            }
            if (data.emails && data.emails[0]) {
                insertdata.email = data.emails[0].value;
            }
            insertdata.token = data.token;
            orfunc.googleid = data.id;
            dbcall(insertdata);
        } else {
            insertdata.linkedinid = data.id;
            insertdata.provider = data.provider;
            insertdata.name = data.displayName;
            if (data.photos && data.photos[0]) {
                insertdata.profilepic = data.photos[0].value;
            }
            if (data.emails && data.emails[0]) {
                insertdata.email = data.emails[0].value;
            }
            insertdata.token = data.token;
            orfunc.linkedinid = data.id;
            dbcall(insertdata);
        }

        function dbcall(data) {
            sails.query(function (err, db) {
                if (err) {
                    callback({
                        value: false
                    });
                }
                data._id = sails.ObjectID();
                db.collection('user').find(orfunc).toArray(function (err, found) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found.length != 0 && found[0]) {
                        var data2 = found[0];
                        data2.id = found[0]._id;
                        delete data2.accessToken;
                        delete data2.token;
                        delete data2.tokenSecret;
                        callback(null, data2);
                        db.close();
                    } else {
                        db.collection('user').insert(data, function (err, created) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (created) {
                                data.id = created.ops[0]._id;
                                delete data.accessToken;
                                delete data.token;
                                delete data.tokenSecret;
                                callback(null, data);
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "Not created"
                                });
                                db.close();
                            }
                        });
                    }
                });
            });
        }
    },
    save: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                data.password = sails.md5(data.password);
                db.collection("user").find({
                    email: data.email
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback({
                            value: false,
                            comment: "User already exists"
                        });
                        db.close();
                    } else {
                        db.collection('user').insert(data, function (err, created) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (created) {
                                data.id = data._id;
                                delete data._id;
                                delete data.password;
                                callback(data);
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "Not created"
                                });
                                db.close();
                            }
                        });
                    }
                });
            }
        });
    },
    addJob: function (data, callback) {
        User.getCompanyProfile(data, function (respo) {
            if (respo.value != false) {

            } else {
                callback({
                    value: false,
                    comment: "No data found"
                });
            }
        });
    },
    edit: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var user = sails.ObjectID(data._id);
                delete data._id
                db.collection('user').update({
                    _id: user
                }, {
                    $set: data
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                        callback({
                            value: true
                        });
                        db.close();
                    } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                        callback({
                            value: true,
                            comment: "Data already updated"
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find().toArray(function (err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findAll: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find().toArray(function (err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    //Findlimited
    findlimited: function (data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("user").count({
                        name: {
                            '$regex': check
                        }
                    }, function (err, number) {
                        if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callbackfunc();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Count of null"
                            });
                            db.close();
                        }
                    });

                    function callbackfunc() {
                        db.collection("user").find({
                            name: {
                                '$regex': check
                            }
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
                            if (err) {
                                callback({
                                    value: false
                                });
                                console.log(err);
                                db.close();
                            } else if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    //Findlimited
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    getCompanyProfile: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: sails.ObjectID(data._id),
                    company: {
                        $exists: true
                    }
                }, {
                    _id: 0,
                    company: 1
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findProfile: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        delete data2[0].forgotpassword;
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('user').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    adminlogin: function (data, callback) {
        if (data.password) {
            data.password = sails.md5(data.password);
            sails.query(function (err, db) {
                if (db) {
                    db.collection('user').find({
                        email: data.email,
                        password: data.password,
                        accesslevel: "admin"
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            callback(found[0]);
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
            });
        } else {
            callback({
                value: false
            });
        }
    },
    login: function (data, callback) {
        data.password = sails.md5(data.password);
        sails.query(function (err, db) {
            db.collection('user').find({
                email: data.email,
                password: data.password
            }, {
                password: 0,
                forgotpassword: 0,
                wishlist: 0,
            }).toArray(function (err, found) {
                if (err) {
                    callback({
                        value: false
                    });
                    console.log(err);
                    db.close();
                }
                if (found && found[0]) {
                    if (found[0].forgotpassword) {
                        db.collection("user").update({
                            email: data.email,
                            password: data.password
                        }, {
                            $set: {
                                forgotpassword: ""
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                db.close();
                            } else if (updated) {
                                db.close();
                            }
                        });
                    }
                    delete found[0].forgotpassword;
                    found[0].id = found[0]._id;
                    delete found[0]._id;
                    callback(found[0]);
                } else {
                    db.collection('user').find({
                        email: data.email,
                        forgotpassword: data.password
                    }, {
                        password: 0,
                        forgotpassword: 0,
                        wishlist: 0
                    }).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        }
                        if (found && found[0]) {
                            sails.ObjectID(data._id);
                            db.collection("user").update({
                                email: data.email
                            }, {
                                $set: {
                                    forgotpassword: "",
                                    password: data.password
                                }
                            }, function (err, updated) {
                                if (err) {
                                    console.log(err);
                                    db.close();
                                } else if (updated) {
                                    db.close();
                                }
                            });
                            found[0].id = found[0]._id;
                            delete found[0]._id;
                            callback(found[0]);
                        } else {
                            callback({
                                value: false
                            });
                            db.close();
                        }
                    });
                }
            });
        });
    },
    changepassword: function (data, callback) {
        if (data.password && data.password != "" && data.editpassword && data.editpassword != "") {
            data.password = sails.md5(data.password);
            var user = sails.ObjectID(data._id);
            var newpass = sails.md5(data.editpassword);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false,
                        comment: "Error"
                    });
                } else if (db) {
                    db.collection("user").update({
                        "_id": user,
                        "password": data.password
                    }, {
                        $set: {
                            "password": newpass
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false,
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified == 1 && updated.result.n == 1) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else if (updated.result.nModified != 1 && updated.result.n == 1) {
                            callback({
                                value: false,
                                comment: "Same password"
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide all parameters"
            });
        }
    },
    forgotpassword: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection('user').find({
                    email: data.email
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 8; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        var encrypttext = sails.md5(text);
                        var user = sails.ObjectID(data2[0]._id);
                        db.collection("user").update({
                            email: data.email
                        }, {
                            $set: {
                                forgotpassword: encrypttext
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                                db.close();
                            } else if (updated) {
                                var template_name = "aura-art";
                                var template_content = [{
                                    "name": "aura-art",
                                    "content": "aura-art"
                                }]
                                var message = {
                                    "from_email": sails.fromEmail,
                                    "from_name": sails.fromName,
                                    "to": [{
                                        "email": data.email,
                                        "type": "to"
                                    }],
                                    "global_merge_vars": [{
                                        "name": "password",
                                        "content": text
                                    }]
                                };
                                sails.mandrill_client.messages.sendTemplate({
                                    "template_name": template_name,
                                    "template_content": template_content,
                                    "message": message
                                }, function (result) {
                                    callback({
                                        value: true,
                                        comment: "Mail Sent"
                                    });
                                    db.close();
                                }, function (e) {
                                    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                });
                            } else {
                                callback({
                                    value: false
                                });
                                db.close();
                            }
                        });
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findDrop: function (data, callback) {
        if (data.search && data.user) {
            var returns = [];
            var exit = 0;
            var exitup = 1;
            var check = new RegExp(data.search, "i");

            function callback2(exit, exitup, data) {
                if (exit == exitup) {
                    callback(data);
                }
            }
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });

                }
                if (db) {
                    db.collection("user").find({
                        name: {
                            '$regex': check
                        },
                    }).limit(10).toArray(function (err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                            db.close();
                        } else if (found != null) {
                            exit++;
                            if (data.user.length != 0) {
                                var nedata;
                                nedata = _.remove(found, function (n) {
                                    var flag = false;
                                    _.each(data.user, function (n1) {
                                        if (n1.name == n.name) {
                                            flag = true;
                                        }
                                    })
                                    return flag;
                                });
                            }
                            returns = returns.concat(found);
                            callback2(exit, exitup, returns);
                        } else {
                            callback({
                                value: false,
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "Please provide parameters"
            });
        }
    },
};