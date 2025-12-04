// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      department: string | null;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    department: string | null;
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    department: string | null;
    email: string;
    name: string;
  }
}