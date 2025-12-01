import PropertyForm from "@/app/components/forms/PropertyForm";
import { Property } from "@/app/lib/definitions";

interface UpdatePropertyModalProps {
  property: Property;
  onSuccess?: () => void;
}

export default function UpdatePropertyModal({
  property,
  onSuccess,
}: UpdatePropertyModalProps) {
  return (
    <PropertyForm
      mode="create"
      initialValues={property}
      onSuccess={onSuccess}
    />
  );
}
