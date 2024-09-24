import { TbError404 } from "react-icons/tb";
import { GiDevilMask } from "react-icons/gi";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <TbError404 className="h-24 w-24" />
      <h1 className="text-3xl font-bold italic font-sans text-red-600">
        Page Not Found
      </h1>
      <GiDevilMask className="h-20 w-20 text-red-700" />
    </div>
  );
};
export default NotFound;
