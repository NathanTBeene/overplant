import SidebarHeader from "./SidebarHeader";
import ComingSoon from "@/components/base/ComingSoon";

const DeleteSection = () => {
  // TODO: Finish implementation
  // const showAlert = useAlertDialog();
  // const [currentSequence, setCurrentSequence] = useState<number>(1);

  // const onDeleteEverything = async () => {
  //   const response = await showAlert({
  //     title: "Delete Everything?",
  //     description: "Are you sure you want to delete all items?",
  //     type: "yes-no-cancel",
  //   });
  // };

  return (
    <div className="flex flex-col space-y-2">
      <SidebarHeader title="Delete" tooltip="Remove selected items" />
      {/* <DeleteButton
        text="Everything"
        className="h-12 bg-accent!"
        onClick={onDeleteEverything}
      />
      <DeleteButton text={`Sequence Step ${currentSequence}`} />
      <div className="flex gap-2 ">
        <DeleteButton icon={<User />} />
        <DeleteButton icon={<Shapes />} />
        <DeleteButton icon={<LineSquiggle />} />
        <DeleteButton icon={<TextSelect />} />
        <DeleteButton icon={<Image />} />
      </div> */}
      <ComingSoon>
        Mass Deleting tools are yet to be implemented. Coming soon.
      </ComingSoon>
    </div>
  );
};

// const DeleteButton = ({
//   icon,
//   text,
//   className,
//   onClick,
// }: {
//   icon?: React.ReactNode;
//   text?: string;
//   className?: string;
//   onClick?: () => void;
// }) => {
//   return (
//     <button
//       className={`bg-fill w-full h-10 rounded-md flex items-center justify-center text-xl font-semibold ${className}`}
//       onClick={onClick}
//     >
//       {icon || text}
//     </button>
//   );
// };

export default DeleteSection;
