import { auth } from "@/auth";
import { getModelCount } from "@/lib/actions/getModelCount";
import DashboardNavigation from "./DashboardNavigation";

export default async function DashboardNavigationServer() {
    const session = await auth();
    const modelCount = await getModelCount();

    return (
        <DashboardNavigation 
            userName={session?.user?.name || "Unknown User"}
            userImage={session?.user?.image || "/placeholder.svg?height=40&width=40"}
            modelCount={modelCount}
        />
    );
}