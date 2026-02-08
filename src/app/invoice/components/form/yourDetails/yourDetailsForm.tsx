import CustomTextInput from "@/app/invoice/components/ui/customTextInput";
import CustomNumberInput from "@/app/invoice/components/ui/customNumberInput";
import ImageInput from "@/app/invoice/components/ui/imageInput";

export const YourDetailsForm = () => (
  <div className="pt-24">
    <p className="text-2xl font-semibold pb-3 dark:text-gray-100">Your Details (From)</p>
    <CustomTextInput
      label="Email"
      placeholder="e.g. john@company.com"
      variableName="yourEmail"
    />
    <p className="pb-10 pt-3 text-xs font-medium text-neutral-500">
      We&apos;ll fill the billing details automatically if we find the your.
    </p>
    <p className="pb-2 text-sm font-medium text-neutral-500">Billing details</p>
    <CustomTextInput
      label="Your Name"
      placeholder="John Doe"
      variableName="yourName"
    />
    <ImageInput label="Logo" variableName="yourLogo" />
    <CustomTextInput
      label="Address"
      placeholder="123 Main Street"
      variableName="yourAddress"
    />
    <CustomTextInput
      label="City"
      placeholder="New York"
      variableName="yourCity"
    />
    <CustomTextInput
      label="State"
      placeholder="NY"
      variableName="yourState"
    />
    <CustomNumberInput
      label="Zip"
      placeholder="10001"
      variableName="yourZip"
    />
    <CustomTextInput
      label="Country"
      placeholder="USA"
      variableName="yourCountry"
    />
    <CustomTextInput
      label="Tax ID"
      placeholder="TAX-1234"
      variableName="yourTaxId"
    />
  </div>
);
