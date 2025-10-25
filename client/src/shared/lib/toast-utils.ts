import { TOAST_TYPES } from "@/src/enums";
import { toast } from "sonner";

export const showToast = (
  types: TOAST_TYPES,
  message: string,
  description?: string
) => {
  switch (types) {
    case TOAST_TYPES.info:
      toast.info(message);
      break;
    case TOAST_TYPES.description:
      toast.message(message, {
        description: description,
      });
      break;
    case TOAST_TYPES.error:
      toast.error(message);
      break;
    case TOAST_TYPES.success:
      toast.success(message);
      break;
    case TOAST_TYPES.warning:
      toast.warning(message);
      break;
  }
};
