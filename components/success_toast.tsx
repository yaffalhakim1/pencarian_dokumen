import { useState } from "react";

interface Props {
  message: string;
}

export default function SuccessInfo(props: Props) {
  const [isOpen, setIsOpen] = useState(true);

  setTimeout(() => {
    setIsOpen(false);
  }, 3000);
  return (
    <>
      <div
        className="toast toast-end"
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <div className="alert alert-success">
          <div>
            <span>{props.message}</span>
          </div>
        </div>
      </div>
    </>
  );
}
