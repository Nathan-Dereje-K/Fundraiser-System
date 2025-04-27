import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown, X } from 'lucide-react';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import Button from '../ui/Button';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentLanguage = i18n.language;

  const languages = [
    { code: 'en', name: t('English'), flag: '🇬🇧', nativeName: t('English') },
    { code: 'am', name: t('Amharic'), flag: '🇪🇹', nativeName: t('አማርኛ') }
  ];

  const currentLangData = languages.find(lang => lang.code === currentLanguage);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      setIsModalOpen(false);
      localStorage.setItem('i18nextLng', lng);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <Languages className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('Language Settings')}
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {t('Select Language')}
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {t('Choose your preferred language for a better experience')}  
              </p>
              <div className="my-3">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  {currentLangData?.nativeName || t('Select Language')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {t('Select Language')}
                    </DialogTitle>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center px-4 py-3 rounded-md text-left ${
                          currentLanguage === lang.code
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-xl mr-3">{lang.flag}</span>
                        <div>
                          <p className="font-medium">{lang.name}</p>
                          <p className="text-sm text-gray-500">{lang.nativeName}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      {t('Cancel')}
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LanguageSwitcher;