import ApiUsage from "@/components/dashboard/profile/api-usage";
import Keygen from "@/components/dashboard/profile/keygen";
import PaymentHistory from "@/components/dashboard/profile/payment-history";
import SecurityLog from "@/components/dashboard/profile/security-log";

export default function Profile() {
	return (
		<div className="mx-auto px-4 py-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-4">
					<Keygen />
					<ApiUsage />
				</div>
				<div className="flex flex-col gap-4">
					<SecurityLog />
					<PaymentHistory />
				</div>
			</div>
		</div>
	);
}
