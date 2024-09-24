import { TfiSearch } from "react-icons/tfi";
import { useQuery } from "@tanstack/react-query";
import Follow from "../../hooks/Follow";

const RightPanel = () => {
  const { data: whotofollow } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggetion");
        const data = await res.json();
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (!whotofollow) return null;
  return (
    <div className=" block w-[35%] xs:hidden sm:hidden md:block md:w-[25%] lg:w-[35%] border-l-[1px] border-gray-700  ">
      <div className="sticky top-0">
        <div
          className=" flex lg:justify-start md:justify-center md:items-center mt-2 ml-5 w-[70%] h-[45px] border rounded-full border-black  bg-neutral-900 focus-within:border-sky-500
      hover:border-sky-500 focus-within:text-sky-500"
        >
          <TfiSearch className=" lg:w-[20%] md:10% h-5 md:mr-2" />
          <input
            type="search"
            name="right"
            id="box"
            placeholder="Search"
            className="lg:w-[80%] md:w-[50%]   h-full bg-transparent p-2 placeholder outline-none text-white"
          />
        </div>

        <div className="flex flex-col">
          <div className=" md:w-[80%] md:text-center lg:text-left lg:pl-4 lg:w-[70%] md:h-[auto] border rounded-3xl border-gray-600 mt-8 ml-5">
            <h1 className="lg:text-left md:text-center  p-1 text-pretty font-bold">
              Subscribe to Premium
            </h1>
            <p className=" md:pl-0 text-sm md:text-balance ">
              Subscribe to unlock new features and if eligible, recceive a share
              of ads revenue.
            </p>
            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/mostasirmahim/",
                  "_blank"
                )
              }
              className=" w-28 mb-2 h-8 hover:scale-105 hover:bg-blue-600 bg-sky-400 rounded-full font-semibold  mt-[8px]"
            >
              Subscribe
            </button>
          </div>
          <div className="border rounded-2xl lg:text-left md:text-center border-gray-800 lg:w-[70%] m-5 lg:p-5 md:p-0 md:w-[80%]">
            <h1 className="lg:text-2xl md:text-xl   w-full font-sans font-bold">
              Trends for you
            </h1>
            <div>
              <div className="flex flex-col  items-start mt-5">
                <h6 className="text-sm  w-full text-gray-500">
                  Sports.Trending
                </h6>
                <h1 className="text-lg  w-full">Bangladesh</h1>
                <h6 className="text-sm  w-full text-gray-500">96.9K posts</h6>
              </div>
              <div className="flex flex-col  items-start mt-5">
                <h6 className="text-sm  w-full text-gray-500">
                  Sports.Trending
                </h6>
                <h1 className="text-lg w-full">#StepDownHasina</h1>
                <h6 className="text-sm w-full text-gray-500">96.9K posts</h6>
              </div>
              <div className="flex flex-col  items-start mt-5">
                <h6 className="text-sm  w-full text-gray-500">
                  Sports.Trending
                </h6>
                <h1 className="text-lg w-full">#QutaMovement</h1>
                <h6 className="text-sm w-full text-gray-500">96.9K posts</h6>
              </div>
              <div className="flex flex-col  items-start mt-5">
                <h6 className="text-sm  w-full text-gray-500">
                  Sports.Trending
                </h6>
                <h1 className="text-lg w-full">#MajorDalim</h1>
                <h6 className="text-sm w-full text-gray-500">96.9K posts</h6>
              </div>
            </div>
          </div>
          {whotofollow.length != 0 && (
            <div className="md:hidden lg:block border rounded-2xl border-gray-800 w-[70%] m-5 ">
              <h1 className="text-lg font-sans font-bold text-left ml-5 mb-3">
                Who to follow
              </h1>
              <div>
                {whotofollow.map((user) => (
                  <Follow key={user._id} user={user} />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col mb-4">
            <ul className="flex space-x-2 text-gray-500 text-sm ml-5">
              <li>Terms of service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
            </ul>
            <ul className="flex space-x-2 text-gray-500 text-sm ml-5">
              <li>Accessibility</li>
              <li>Ads info</li>
              <li>More...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
