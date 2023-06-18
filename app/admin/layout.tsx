import Header from "@yaris/components/Header";
import { ReactNode } from "react";
import SignOutButton from "@yaris/components/SignOutButton";
export default function Layout({ children }: { children: ReactNode }) {
    return (<main>
        <Header >
            <SignOutButton/>
        </Header>
        {children}
    </main>)

}