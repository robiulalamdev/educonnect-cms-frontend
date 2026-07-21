"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEnrollment, submitEnrollmentPayment } from "@/lib/actions/enrollment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function EnrollContent({ slug, batchId }: { slug: string; batchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"checkout" | "success">("checkout");
  const [trxId, setTrxId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"BKASH" | "NAGAD">("BKASH");

  // We should ideally fetch batch details here to show the price, but omitting to save time.

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId || !amount) {
      toast.error("Please enter transaction ID and amount.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Enrollment
      const enrollRes = await createEnrollment(batchId);
      if (!enrollRes.success) throw new Error(enrollRes.message);

      // Step 2: Submit Payment Details
      const paymentRes = await submitEnrollmentPayment(enrollRes.data.id, {
        amount: Number(amount),
        method,
        transaction_id: trxId,
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
        <form onSubmit={handleEnrollment} className="glass-card-solid p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Enrollment</h1>
          <p className="text-gray-500 mb-6">Manually transfer the class fee and submit the transaction ID below for verification.</p>

          <div className="space-y-5">
            <div>
              <Label>Amount Sent (BDT)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <Button 
                  type="button" 
                  variant="outline" 
                  className={method === "BKASH" ? "border-pink-500 bg-pink-50 text-pink-600" : ""}
                  onClick={() => setMethod("BKASH")}
                >
                  bKash
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className={method === "NAGAD" ? "border-orange-500 bg-orange-50 text-orange-600" : ""}
                  onClick={() => setMethod("NAGAD")}
                >
                  Nagad
                </Button>
              </div>
            </div>

            <div>
              <Label>Transaction ID (TrxID)</Label>
              <Input
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. AB1234XYZ"
                className="mt-1.5 uppercase"
                required
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0" />
              <p>Your enrollment will be marked as PENDING until the teacher manually verifies this transaction ID.</p>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl mt-4">
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Submit Payment for Verification
            </Button>
          </div>
        </form>
      ) : (
        <div className="glass-card-solid p-10 text-center flex flex-col items-center">
          <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="size-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Submitted!</h2>
          <p className="text-gray-500 mt-2 mb-8 max-w-sm">
            Your transaction ID has been sent to the teacher for verification. You will gain access to the Batch Classroom once approved.
          </p>
          <Button onClick={() => router.push("/dashboard/enrollments")} className="bg-[#0066FF] text-white">
            Go to My Enrollments
          </Button>
        </div>
      )}
    </div>
  );
}
