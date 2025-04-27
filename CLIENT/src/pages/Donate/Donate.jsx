import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Chapa from "./Chapa";
import Braintree from "./Braintree";
import { Fragment } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const Donate = ({ campaignId }) => {
  const { t } = useTranslation();

  return (
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
              {t("Local")}
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
              {t("International")}
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
  );
};

export default Donate;