import { ReactNode } from "react";

interface Props {
  isDisabled: boolean;

  children: ReactNode;

  onClick: () => void;
}

export default function IconButton(props: Props) {
  const { isDisabled, onClick, children } = props;

  return (
    <div
      className={`flex items-center justify-center h-2/3 aspect-square rounded-full ${
        !isDisabled
          ? "bg-green-400 hover:bg-green-600 hover:cursor-pointer"
          : "bg-gray-500 hover:cursor-not-allowed"
      }   disabled:bg-gray-500`}
      onClick={() => {
        if (!isDisabled) onClick();
      }}
    >
      {children}
    </div>
  );
}
