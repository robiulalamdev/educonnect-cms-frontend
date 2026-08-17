"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEnrollment, submitEnrollmentPayment } from "@/lib/actions/enrollment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { value: "BKASH", label: "bKash", color: "pink" },
  { value: "NAGAD", label: "Nagad", color: "orange" },
  { value: "ROCKET", label: "Rocket", color: "purple" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", color: "blue" },
  { value: "CASH", label: "Cash", color: "green" },
  { value: "OTHER", label: "Other", color: "gray" },
] as const;

type PaymentMethod = typeof PAYMENT_METHODS[number]["value"];

export function EnrollContent({ slug, batchId }: { slug: string; batchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"checkout" | "success">("checkout");
  const [trxId, setTrxId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("BKASH");
  const [senderName, setSenderName] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [note, setNote] = useState("");
  const [paymentFor, setPaymentFor] = useState<"JOINING_FEE" | "MONTHLY_FEE" | "PER_SESSION">("JOINING_FEE");

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId || !amount) {
      toast.error("Please enter transaction ID and amount.");
      return;
    }

    setLoading(true);
    try {
      const enrollRes = await createEnrollment(batchId);
      if (!enrollRes.success) throw new Error(enrollRes.message);

      const paymentRes = await submitEnrollmentPayment(enrollRes.data.id, {
        amount: Number(amount),
        method,
        transaction_id: trxId,
        sender_name: senderName || undefined,
        sender_number: senderNumber || undefined,
        note: note || undefined,
        payment_for: paymentFor,
      });

      if (!paymentRes.success) throw new Error(paymentRes.message);
      
      setStep("success");
    } catch (err: any) {
      toast.error(err.message || "Failed to process enrollment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {step === "checkout" ? (
        <form onSubmit={handleEnrollment} className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Enrollment</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-[14px]">Transfer the class fee and submit the transaction details below for verification.</p>

          <div className="space-y-5">
            {/* Payment For */}
            <div>
              <Label className="text-[13px] font-semibold">Payment For</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { value: "JOINING_FEE" as const, label: "Joining Fee" },
                  { value: "MONTHLY_FEE" as const, label: "Monthly Fee" },
                  { value: "PER_SESSION" as const, label: "Per Session" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPaymentFor(opt.value)}
                    className={`px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all ${
                      paymentFor === opt.value
                        ? "border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF]"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label className="text-[13px] font-semibold">Amount Sent (BDT)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="mt-1.5 h-11 rounded-xl"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-[13px] font-semibold">Payment Method</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => setMethod(pm.value)}
                    className={`px-3 py-2.5 rounded-xl text-[12px] font-semibold border transition-all ${
                      method === pm.value
                        ? "border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF]"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <Label className="text-[13px] font-semibold">Transaction ID (TrxID)</Label>
              <Input
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. AB1234XYZ"
                className="mt-1.5 h-11 rounded-xl uppercase"
                required
              />
            </div>

            {/* Sender Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[13px] font-semibold">Sender Name</Label>
                <Input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Name on account"
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[13px] font-semibold">Sender Number</Label>
                <Input
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <Label className="text-[13px] font-semibold">Note (Optional)</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any additional info..."
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-[13px] flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <p>Your enrollment will be marked as PENDING until the teacher manually verifies this payment.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-500/20">
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit Payment for Verification
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-10 text-center flex flex-col items-center">
          <div className="size-16 bg-green-50 dark:bg-green-950/50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="size-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8 max-w-sm">
            Your transaction details have been sent to the teacher for verification. You will gain access once approved.
          </p>
          <Button onClick={() => router.push("/dashboard/enrollments")} className="bg-[#0066FF] text-white rounded-full">
            Go to My Enrollments
          </Button>
        </div>
      )}
    </div>
  );
}
