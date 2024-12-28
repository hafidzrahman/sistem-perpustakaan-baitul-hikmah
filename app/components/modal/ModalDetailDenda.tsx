import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CancelCircleHalfDotIcon } from "hugeicons-react";

interface DetailDenda {
  isOpen: boolean;
  onClose: () => void;
  formBuktiId: number | null;
}

interface FormBuktiDetail {}

const ModalDetailDenda: React.FC<DetailDenda> = ({
  isOpen,
  onClose,
  formBuktiId,
}) => {
  return <></>;
};

export default ModalDetailDenda;
