import NextAuth from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "../../../lib/mongodb"
// import FacebookProvider from "next-auth/providers/facebook";
// import CredentialsProvider from "next-auth/providers/credentials"
// import { apipath } from "../apiPath";

export default NextAuth({
  providers: [
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. 'Sign in with...')
    //   name: 'Credentials',
    //   credentials: {
    //     email: { label: "Email", type: "email", placeholder: "jsmith" },
    //     password: {  label: "Password", type: "password" }
    //   },
    //   async authorize(credentials, req) {
    //     return { id: 1, name: "J Smith", email: "jsmith@example.com" }
    //     // const res = await fetch(`${apipath}/api/v1/users/signin`, {
    //     //   method: 'POST',
    //     //   body: JSON.stringify(credentials),
    //     //   headers: { "Content-Type": "application/json" }
    //     // })
    //     // const user = await res.json()
    //     // if (res.ok && user) {
    //     //   return user
    //     // }
    //     // return null
    //   }
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorizationUrl:
      //   'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code"
      //   }
      // }
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code"
    //     }
    //   }
    // })

  ],
  adapter: MongoDBAdapter(clientPromise),
  // jwt: {
  //   encryption: true,
  // },
  secret: process.env.SECRET,
  pages:{
    signIn:"/home"
  },
  session: {
    strategy: 'jwt',
  }
  // callbacks: {
  //   async signIn({ user, account, profile }) {
  //     const payload = {
  //       full_Name: user.name,
  //       email: user.email,
  //       logged_by: account.provider,
  //       logged_id: user.id,
  //       is_email_verified: profile.email_verified
  //     }
      
  //     fetch(`${apipath}/api/v1/users/social`, {
  //       method:"POST",
  //       headers: {
  //         'Content-Type':'application/json'
  //       },
  //     body:JSON.stringify(payload)
  //     })
  //     .then(res => res.json())
  //     .then((result) => {
  //       console.log('result :>> ', result);
  //       return result
  //     }).catch((err) => {
  //       console.log('err :>> ', err);
  //     });
  //     if (account.provider === "google") {
  //       return profile.email_verified && profile.email.endsWith("@gmail.com")
  //     }
  //     return true
  //   },
  //   async jwt({token, account}){
  //     if(account?.access_token){
  //       token.accessToken = account.access_token;
  //     }
  //     return token;
  //   },
  //   // async credentials( user,acount,profile) {
  //   //   return Promise.resolve(true)
  //   // },
  //   async redirect({url, baseUrl}) {
  //     if(url === '/'){
  //       return Promise.resolve('/');
  //     }
  //     return Promise.resolve('/');
  //   },
  // }
})