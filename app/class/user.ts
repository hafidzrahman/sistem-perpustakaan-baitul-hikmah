import { guruType, muridType, petugasPerpustakaanType, prisma, userType } from "@/lib";


export class User {
    id? : string
    username : string;
    password : string;
    role : string;

    constructor(data : userType) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.role = data.role;
    }

    static async tambahUser(data : userType) : Promise<userType> {
        const {username, password, role} = data;

        if (!username || !password || !role) {
            throw new Error("Harus mengisi field yang wajib");
        }

        const dataUser = await prisma.user.create({
            data : {
                username,
                password,
                role
            }
        })
        return dataUser;
    }
    static async cariUser(username : string) : Promise<userType | null & guruType | null & muridType | null & petugasPerpustakaanType | null> {
        const user = await prisma.user.findUnique({
            where: {
              username: username,
            },
            include: {
              guru: true,
              murid: true,
              petugasPerpustakaan: true,
            },
          });

          return user;
    }
}