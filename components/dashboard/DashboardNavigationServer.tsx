import { auth } from "@/auth";
import { getModelCount } from "@/lib/actions/getModelCount";
import DashboardNavigation from "./DashboardNavigation";
import { headers } from "next/headers";

export default async function DashboardNavigationServer() {
    const headerList = await headers()
    const session = await auth.api.getSession({
        headers: headerList// you need to pass the headers object.
    })
    if (!session) {
        return ""
    }
    const modelCount = await getModelCount();

    return (
        <DashboardNavigation 
            userName={session?.user?.name || "Unknown User"}
            userImage={session?.user?.image || "/placeholder.svg?height=40&width=40"}
            modelCount={modelCount}
        />
    );
}