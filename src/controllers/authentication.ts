import express from 'express';
import { CreateUser, getUserbyEmail } from '../db/user';
import { random,authentication } from '../helpers';

export const login = async(req:express.Request,res:express.Response)=>{
    try{
        const {email,password}= req.body;
        if(!email|| !password){
            return res.sendStatus(400);
        }
        const user = await getUserbyEmail(email).select('+authentication.salt +authentication.password');

        if(!user){
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt,password);

        if(user.authentication.password !== expectedHash){
            return res.sendStatus(403);
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt,user._id.toString())
        await user.save();
        res.cookie('abcd-api',user.authentication.sessionToken,{domain:'localhost',path:'/'})
        return res.status(200).json(user).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async(req:express.Request,res:express.Response)=>{
    try{
        const{email,password,username} = req.body;

        if(!email || !password ||!username){
            return res.sendStatus(400);
        }
        const exisitinguser = await getUserbyEmail(email);
        
        if(exisitinguser){
            return res.sendStatus(400);
        }
        const salt =  random();
        const user =  await CreateUser({
            email,username,authentication:{
                salt,
                password:authentication(salt,password)
            }
        })
        return res.status(200).json(user).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}