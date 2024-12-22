import type {NextAuthOptions} from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from "./lib";
import { compare,  } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session : {
        strategy : 'jwt'
    },
    providers : [
        CredentialsProvider({
            name: "Credentials",
            type : "credentials",
            credentials: {
                username : {
                    label : "Username",
                    type : "text",
                },
                password : {
                    label : "Password",
                    type : "password",
                },
                
            },
                async authorize(credentials) {
                    if (!credentials?.username || !credentials?.password) {
                        return null
                    }
                    const user = await prisma.user.findUnique({
                        where : {
                            username : credentials.username
                        },
                        include : {
                            guru : true,
                            murid : true,
                            petugasPerpustakaan : true
                        }
                    })
                    if (!user || !(await compare(credentials.password, user.password))) {
                        return null
                    }
                    const date = new Date();
                    return {
                        id : user.id,
                        username : user.username,
                        name : user.petugasPerpustakaan?.nama || user.guru?.nama || user.murid?.nama,
                        role : user.role,
                        randomKey : date.toISOString(),
                    };
                }
            
        })
    ],
    callbacks : {
        session : ({session, token}) => {
            console.log({session, token})
            return {
                ...session,
                user : {
                    ...session.user,
                    id : token.id,
                    username : token.username,
                    name : token.name,
                    role : token.role,
                    randomKey : token.randomKey
                }
            }
        },
        jwt : ({token, user}) => {
            console.log({token, user})
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id : u.id,
                    username : u.username,
                    name : u.name,
                    role : u.role,
                    randomKey : u.randomKey
                };
            }
            return token;
        }
    },
    pages : {
        signIn : "/login"
    }
}
