import CustomTextInput from "@/app/invoice/components/ui/customTextInput";
import CustomNumberInput from "@/app/invoice/components/ui/customNumberInput";

export const PaymentDetailsForm = () => (
  <div className="pt-24">
    <p className="text-2xl font-semibold pb-3 dark:text-gray-100">Payment Details</p>
    <CustomTextInput
      label="Bank name"
      placeholder="Bank of America"
      variableName="bankName"
    />
    <CustomTextInput
      label="Account number"
      placeholder="1234567890"
      variableName="accountNumber"
    />
    <CustomTextInput
      label="Account Name"
      placeholder="John Doe"
      variableName="accountName"
    />
    <CustomTextInput
      label="Transit Number"
      placeholder="00123"
      variableName="transitNumber"
    />
    <CustomTextInput
      label="Routing number"
      placeholder="026009593"
      variableName="routingCode"
    />
    <CustomNumberInput
      label="Swift code"
      placeholder="BOFAUS3N"
      variableName="swiftCode"
    />
  </div>
);
