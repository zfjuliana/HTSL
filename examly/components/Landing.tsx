import React, { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes, faSearch, faFile, faCode } from "@fortawesome/free-solid-svg-icons";

const Landing: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="bg-gradient-to-r from-lightBlue-300 via-lightBlue-400 to-lightBlue-500 min-h-screen w-full h-full overflow-x-hidden">
      <div className="flex items-center justify-start px-6 md:px-12 pt-24 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[0.3fr_0.8fr_0.7fr_1fr] md:grid-rows-[0.3fr_0.8fr_1fr_1.5fr] tracking-tighter mt-10 md:mt-0 -ml-2 md:-ml-0">
          {/* Title */}
          <div className="row-span-1 flex justify-start items-end text-blue-800">
            <div>
              <h1 className="text-9xl font-bold">Examly</h1>
            </div>
          </div>

          {/* Subtitle */}
          <div className="row-span-1 md:[grid-area:2/1/3/2] mt-10 md:mt-[50px] flex justify-start items-end">
            <h2 className="text-6xl font-medium text-black dark:text-white">
              We <span className="font-semibold text-blue">eliminate the chaos</span> of exam scheduling.
            </h2>
          </div>

          {/* Buttons */}
          <div className="row-span-1 md:[grid-area:4/1/5/2]">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="Button-primary">
                  <button
                    type="button"
                    className="text-white font-semibold border border-2 bg-gray-800 hover:bg-blue-800 rounded-2xl text-2xl px-9 py-3 md:px-12 md:py-3 me-2 mb-2"
                    onClick={() => router.push("/signup")}
                  >
                    Signup
                  </button>
                </div>
                <div className="Button-secondary">
                  <button
                    type="button"
                    className="text-black font-semibold border border-2 hover:bg-gray-200 rounded-2xl text-2xl px-9 md:px-12 py-3 me-2 mb-2"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Button and Dropdown Container */}
          <div className="row-span-1 md:[grid-area:4/2/5/3] flex justify-between md:justify-end items-end relative">
            
            <div className="relative">
              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute bottom-full mb-2 flex flex-col items-start justify-end w-[260px] p-4 transition-all duration-300 -ml-[193px] gap-4">
                  <div className="flex items-center justify-end w-full gap-4 text-xl text-black dark:text-white">
                    <button
                      onClick={() =>
                        router.push({
                          pathname: "/blogs",
                        })
                      }
                    >
                      Search <span className="text-purple">posts</span>
                    </button>

                    <button
                      type="button"
                      className="w-10 h-10 bg-gray-100 rounded-full bg-purple hover:bg-darkerpurple hover:bg-gray-200 transition"
                      onClick={() =>
                        router.push({
                          pathname: "/blogs",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faSearch} className="text-white" />
                    </button>
                  </div>

                  <div className="flex items-center justify-end w-full gap-4 text-xl text-black dark:text-white">
                    <button
                      onClick={() =>
                        router.push({
                          pathname: "/templates",
                        })
                      }
                    >
                      Explore <span className="text-purple">templates</span>
                    </button>

                    <button
                      type="button"
                      className="w-10 h-10 rounded-full bg-gray-100 bg-purple hover:bg-darkerpurple hover:bg-gray-200 transition"
                      onClick={() =>
                        router.push({
                          pathname: "/templates",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faFile} className="text-white" />
                    </button>
                  </div>

                  <div className="flex items-center justify-end w-full gap-4 text-xl text-black dark:text-white">
                    <button
                      onClick={() =>
                        router.push({
                          pathname: "/editor",
                        })
                      }
                    >
                      Write <span className="text-purple">code</span>
                    </button>

                    <button
                      type="button"
                      className="w-10 h-10 bg-gray-100 rounded-full bg-purple hover:bg-darkerpurple hover:bg-gray-200 transition"
                      onClick={() =>
                        router.push({
                          pathname: "/editor",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faCode} className="text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* Arrow Button */}
              <button
                type="button"
                onClick={handleClick}
                className="text-white text-3xl font-semibold bg-purple hover:bg-darkerpurple rounded-full w-16 h-16 relative flex items-center justify-center mb-5"
              >
                {isOpen ? (
                  <FontAwesomeIcon icon={faTimes} className="text-white" />
                ) : (
                  <FontAwesomeIcon icon={faArrowRight} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
