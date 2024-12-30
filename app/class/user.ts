import {
  guruType,
  muridType,
  updtUserType,
  petugasPerpustakaanType,
  prisma,
  userType,
} from "@/lib";
import { hash } from "bcryptjs";

export class User {
  id?: string;
  username: string;
  password: string;
  role: string;

  constructor(data: userType) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.role = data.role;
  }

  static async addUser(data: userType): Promise<userType> {
    const {
      username,
      password,
      role,
      muridNIS,
      guruNIP,
      petugasPerpustakaanId,
    } = data;

    if (!username || !password || !role) {
      throw new Error("Harus mengisi field yang wajib");
    }
    const hashedPassword = await hash(password, 12);
    const dataUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        muridNIS,
        guruNIP,
        petugasPerpustakaanId,
      },
    });
    return dataUser;
  }
  static async findUser(
    username: string
  ): Promise<
    | userType
    | (null & guruType)
    | (null & muridType)
    | (null & petugasPerpustakaanType)
    | null
  > {
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

  static async updtUser(
    username: string,
    data: updtUserType
  ): Promise<
    | userType
    | (null & guruType)
    | (null & muridType)
    | (null & petugasPerpustakaanType)
    | null
  > {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user?.id) {
      throw new Error("Data user tidak ditemukan");
    }

    const { password, role } = data;

    if (password) {
      const hashedPassword = await hash(password, 12);
      const updatedUser = await prisma.user.update({
        where: {
          username,
        },
        data: {
          password: hashedPassword,
          role: role || user?.role,
        },
      });
      return updatedUser;
    }

    const updatedUser = await prisma.user.update({
      where: {
        username,
      },
      data: {
        role: role || user?.role,
      },
    });

    return updatedUser;
  }
}
