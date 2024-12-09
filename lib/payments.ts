import crypto from "node:crypto";
import axios from "axios";

interface CryptomusWebhookData {
	status: string;
	uuid: string;
	order_id?: string;
	currency?: string;
	network?: string;
	amount?: string;
}

interface CryptomusTestWebhookParams {
	url_callback: string;
	currency: string;
	network: string;
	status:
		| "process"
		| "check"
		| "paid"
		| "paid_over"
		| "fail"
		| "wrong_amount"
		| "cancel"
		| "system_fail"
		| "refund_process"
		| "refund_fail"
		| "refund_paid";
	uuid?: string;
	order_id?: string;
}

export function validateCryptomusWebhook(
	webhookData: CryptomusWebhookData,
	signature: string,
): boolean {
	const paymentKey = process.env.CRYPTOMUS_PAYMENT_KEY;
	if (!paymentKey) throw new Error("CRYPTOMUS_PAYMENT_KEY not configured");

	// Create signature using webhook data and payment key
	const dataToSign = JSON.stringify(webhookData);
	const expectedSignature = crypto
		.createHmac("sha256", paymentKey)
		.update(dataToSign)
		.digest("hex");

	return signature === expectedSignature;
}

export async function processCryptomusPayment(
	webhookData: CryptomusWebhookData,
): Promise<{ success: boolean; error?: string }> {
	try {
		switch (webhookData.status) {
			case "paid":
				// Handle successful payment
				return { success: true };

			case "fail":
			case "wrong_amount":
			case "system_fail":
				// Handle failed payment
				return {
					success: false,
					error: `Payment failed with status: ${webhookData.status}`,
				};

			default:
				// Handle other statuses
				return {
					success: false,
					error: `Unhandled payment status: ${webhookData.status}`,
				};
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export async function sendTestWebhook(params: CryptomusTestWebhookParams) {
	const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
	const paymentKey = process.env.CRYPTOMUS_PAYMENT_KEY;

	if (!merchantId || !paymentKey) {
		throw new Error("Cryptomus credentials not configured");
	}

	const sign = crypto
		.createHash("md5")
		.update(Buffer.from(JSON.stringify(params)).toString("base64") + paymentKey)
		.digest("hex");

	try {
		const response = await axios.post(
			"https://api.cryptomus.com/v1/test-webhook/payment",
			params,
			{
				headers: {
					merchant: merchantId,
					sign: sign,
					"Content-Type": "application/json",
				},
			},
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				`Cryptomus API error: ${error.response?.data?.message || error.message}`,
			);
		}
		throw error;
	}
}

const x = await sendTestWebhook({
	url_callback: "http://localhost:3000/api/webhooks/cryptomus",
	currency: "USDT",
	network: "TRX",
	status: "paid",
	uuid: "123",
	order_id: "123",
});

console.log(x);
