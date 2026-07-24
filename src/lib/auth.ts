import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Téléphone", type: "tel" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { phone: credentials.phone },
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.phone = (user as typeof user & { phone?: string }).phone;
            }
            if (trigger === "update" && session) {
                if (typeof session.name === "string") token.name = session.name;
                if (typeof session.phone === "string") token.phone = session.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                const sessionUser = session.user as typeof session.user & {
                    id?: string;
                    phone?: string;
                };
                sessionUser.id = typeof token.id === "string" ? token.id : undefined;
                sessionUser.phone =
                    typeof token.phone === "string" ? token.phone : undefined;
                sessionUser.name = token.name;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "default_secret_for_dev_only",
};
