const express = require('express')
const passport = require('passport')
const router = express.Router()
const user  = require('../models/userModel')

const checkAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        console.log('authentication successfull')
        next();
    }else{
        console.log('redirecting')
        res.redirect('/login')
    }
}


router.get('/',(req,res)=>{
    res.render('login',{title:"Login"})
})

router.get('/bcl',checkAuthenticated,async(req,res)=>{
    await user.find({}).sort({username:"asc"}).exec((err,results)=>{
        if(err){
            console.log(err)
        }else{
            //console.log(results)
            res.render('bcl',{title:"Business Contact List",list:results})
        }
    })
})

router.get('/logout',(req,res)=>{
    console.log("logging out")
    req.logout((err)=>{
        if(err){
            console.log(er)
        }else{
            res.redirect('/login')
        }
    });
    
})

router.post('/',passport.authenticate('local',{
    successRedirect:'/login/bcl',
    failureRedirect:'/login'
}))


router.get('/register',(req,res)=>{
    res.render('Register',{title:"Register"})
})
 

router.post('/register',(req,res)=>{
    const newObj = new user({
        username:req.body.username,
        password:req.body.password,
        contactnumber:req.body.contactnumber,
        email:req.body.email
    })

    newObj.save((err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
            res.redirect('/login')
        }
    })
    
})

router.get('/edit/:id',checkAuthenticated,async(req,res)=>{
    console.log(req.params.id)
    console.log("inside post edit method1")
    await user.findOne({_id:req.params.id},(err,results)=>{
        if(err){
            console.log(err)
        }else{
            console.log(results)
            res.render('update',{title:"Update",list:results})
        }
    }).clone().catch(function(err){ console.log(err)})
})

router.post('/edit/:id',checkAuthenticated,async(req,res,next)=>{
    const newDetails={
        "username":req.body.username,
        "password":req.body.password,
        "contactnumber":req.body.contactnumber,
        "email":req.body.email
    }
    
    await user.findOneAndUpdate({_id:req.params.id},newDetails,(err,results)=>{
        if(err){
          console.log(err)
        }else{
            console.log(results)
            res.redirect('/login/bcl');
        }
      }).clone().catch(function(err){ console.log(err)})
})

router.get('/delete/:id',checkAuthenticated,async(req,res,next)=>{
    console.log(req.params.id)
    await user.deleteOne({_id:req.params.id},(err,results)=>{
        if(err){
            next()
        }else{
            console.log(results)
            res.redirect('/login/bcl');
        }
    })
})
module.exports = router