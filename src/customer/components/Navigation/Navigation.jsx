import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';
import { Gi3dHammer } from "react-icons/gi";
import AlertCarousel from './AlertCarousel';

const navigation = [
  { name: 'Earn $$$', href: '#', current: false },
  { name: 'Happy Customers', href: '#', current: false },
  { name: 'Newsletter', href: '#', current: false },
  { name: 'Wholesale', href: '#', current: false },
]

const categories = [
  { name: "Shop By Category", href: "#", current: false },
  { name: "Deals", href: "#", current: false },
  { name: "Shipping and Returns", href: "/shippingreturns", current: false },
  { name: "Customer Support", href: "/support", current: false },
  { name: "FAQs", href: "/faq", current: false }
]



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation() {

  const alerts = [
    "Free shipping for orders over $100!",
    "New DIY kits just released!",
    "Sign up for our newsletter and get 10% off!"
  ];
  return (
    <>
      {/* Alerts */}
      <div className="w-full bg-orange-500">
        <AlertCarousel alerts={alerts} />
      </div>


      <Disclosure as="nav" className="relative bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <Link to="/">
                  <Gi3dHammer className="text-orange-500 w-12 h-12 mr-2" />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                        'rounded-md px-4 py-3 text-lg font-medium',
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <form className="w-full max-w-[26rem] mx-auto">
                <label htmlFor="default-search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-800 dark:text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                    required
                  />
                  <button
                    type="submit"
                    className="text-gray-700 absolute end-2.5 bottom-2.5 bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-500 font-bold rounded-lg text-sm px-4 py-2"
                  >
                    Search
                  </button>
                </div>
              </form>


            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex flex-col items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>

                <UserIcon aria-hidden="true" className="text-gray-300 w-8 h-8" />
                <span className="text-gray-300 text-xs font-medium mt-1">Sign In</span>
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <ShoppingCartIcon aria-hidden="true" className="text-gray-300 w-8 h-8" />
              </button>
            </div>
          </div>
        </div>


        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {categories.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>

            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/*categories for shopping*/}
      <div className="bg-gray-800 text-center h-16 py-3 text-md drop-shadow-lg ">
        <div className="sm:block ">
          <div className="flex justify-center space-x-6 ">
            {categories.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  'rounded-md px-3 py-2 text-lg font-medium'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>)
}
