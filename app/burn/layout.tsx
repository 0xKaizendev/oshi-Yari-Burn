import Header from "@yaris/components/Header";
import { ReactNode } from "react";
import SignInButton from "@yaris/components/SignInButton";
export default function Layout({ children }: { children: ReactNode }) {
    return (<main>
        <Header >
            <SignInButton/>
        </Header>
        {children}
    </main>)

}