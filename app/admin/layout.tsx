import Header from "@yaris/components/Header";
import { ReactNode } from "react";
export default function Layout({ children }: { children: ReactNode }) {
    return (<main>
        <Header >
          <p></p>
        </Header>
        {children}
    </main>)

}