import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (
          username !== process.env.ADMIN_USERNAME ||
          password !== process.env.ADMIN_PASSWORD
        ) {
          throw new Error("invalid credentials");
        }
        return {
          id: "1234",
          name: username,
        };
      },
    }),
  ],

  callbacks: {
    jwt(params) {
      if (params.user?.name) {
        params.token.name = params.user.name;
      }
      return params.token;
    },
    redirect() {
      return "/admin";
    },
  },
};
