import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Chapa from "./chapa";
import Braintree from "./Braintree";
import { Fragment } from "react";
import clsx from "clsx";
const Donate = ({ campaignId }) => {
  return (
    // <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
    <TabGroup>
      <TabList className="flex border-b border-gray-300">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={clsx(
                "w-full px-4 py-2 text-center transition-colors duration-300 rounded-t-md",
                selected
                  ? "bg-blue-500 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              Local
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={clsx(
                "w-full px-4 py-2 text-center transition-colors duration-300 rounded-t-md",
                selected
                  ? "bg-blue-500 text-white font-semibold"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              International
            </button>
          )}
        </Tab>
      </TabList>

      <TabPanels className="mt-4 p-4">
        <TabPanel>
          <Chapa campaignId={campaignId} />
        </TabPanel>
        <TabPanel>
          <Braintree campaignId={campaignId} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
    // </div>
  );
};

export default Donate;
