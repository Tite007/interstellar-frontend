'use client'
import React, { useContext, useState, useEffect } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown'
import { useSession, signOut } from 'next-auth/react'
import { Avatar } from '@heroui/avatar'
import { Badge } from '@heroui/badge'
import ShoppingCartSheet from '@/src/components/Product-details/ShoppingCartSheet'
import { CartContext } from '@/src/context/CartContext'
import { User, ChevronDown, Search } from 'lucide-react'
import CategoryMenuSheet from '@/src/components/Navbar/CategoryMenuSheet' // Import the new CategoryMenuSheet component
import SearchModal from '@/src/components/Navbar/SearchModal' // Import the new SearchModal component
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Utility function to format category or subcategory names for URLs
const formatCategoryName = (name) => {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/\s&\s/g, '-&-') // Replace spaces around '&' with '-&-'
    .replace(/\s+/g, '-') // Replace remaining spaces with dashes
    .replace(/[^\w-&]+/g, '') // Remove special characters except alphanumeric, dashes, and '&'
}

export default function MainNavbarCustomer() {
  const { data: session, status } = useSession()
  const { cart } = useContext(CartContext)
  const [hydrated, setHydrated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // Control mobile menu state
  const [activeCategory, setActiveCategory] = useState(null)
  const [shopCategories, setShopCategories] = useState([])
  const router = useRouter()

  const isUser = session?.user?.role === 'user'

  useEffect(() => {
    setHydrated(true)

    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/categories`)
        const data = await response.json()

        // Separate categories and subcategories
        const parentCategories = data.filter(
          (category) => category.parent === null,
        )
        const formattedCategories = parentCategories.map((category) => ({
          label: category.name,
          href: `/categories/${formatCategoryName(category.name)}`,
          subcategories: data
            .filter(
              (subcategory) =>
                subcategory.parent && subcategory.parent._id === category._id,
            )
            .map((subcategory) => ({
              label: subcategory.name,
              href: `/categories/${formatCategoryName(category.name)}/${formatCategoryName(subcategory.name)}?subcategoryId=${subcategory._id}`,
            })),
        }))
        setShopCategories(formattedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const cartItemCount = cart.length

  if (!hydrated) {
    return null
  }

  const menuItems = [{ label: 'Home', href: '/' }]

  const handleLinkClick = () => {
    // Close the menu after clicking a link
    setIsMenuOpen(false)
  }

  return (
    <Navbar
      maxWidth="2xl"
      className=" bg-redBranding shadow-lg"
      isMenuOpen={isMenuOpen} // Control menu visibility
      onMenuOpenChange={(isOpen) => setIsMenuOpen(isOpen)} // Update state when toggling menu
    >
      <NavbarContent>
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle menu on click
        />*/}
        <NavbarItem>
          <CategoryMenuSheet shopCategories={shopCategories} />
        </NavbarItem>
        <NavbarBrand>
          <Link href="/">
            <Image
              src="/muchio_logo.webp"
              alt="Muchio Logo"
              width={150}
              height={50}
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/*<NavbarContent className="hidden sm:flex gap-4 " justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}

        <Dropdown>
          <DropdownTrigger>
            <Button
              disableRipple
              className="p-0 text-md bg-transparent data-[hover=true]:bg-transparent"
              endContent={<ChevronDown size={20} />}
              radius="sm"
              variant="light"
            >
              Shop
            </Button>
          </DropdownTrigger>

          <DropdownMenu aria-label="Shop categories" className="w-[240px]">
            {shopCategories.map((category) => (
              <DropdownItem
                key={category.label}
                className="relative gap-2"
                onMouseEnter={() => setActiveCategory(category.label)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={category.href}
                  className="w-full flex items-center font-bold"
                  onClick={handleLinkClick} // Close the menu when a category is clicked
                >
                  {category.label}
                </Link>

                {activeCategory === category.label &&
                  category.subcategories.length > 0 && (
                    <div className="absolute left-full top-0 bg-white shadow-lg p-4 w-48 flex border rounded-xl flex-col">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.label}
                          href={subcategory.href}
                          className="text-sm mb-2 text-default-500 hover:text-primary w-full"
                          onClick={handleLinkClick} // Close the menu when a subcategory is clicked
                        >
                          {subcategory.label}
                        </Link>
                      ))}
                    </div>
                  )}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>*/}

      {/* Modify NavbarContent to conditionally render based on isMenuOpen */}
      <NavbarContent justify="end" className="items-center gap-4">
        <SearchModal />
        {status === 'unauthenticated' && (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <User color="white" size={24} strokeWidth={1.5} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Login Actions" variant="flat">
              <DropdownItem key="login">
                <Link
                  as={Link}
                  href="/customer/login"
                  color="primary"
                  size="sm"
                  className="w-full text-left"
                  onPress={handleLinkClick}
                >
                  Login
                </Link>
              </DropdownItem>
              <DropdownItem key="signup">
                <Link
                  as={Link}
                  href="/customer/sign-up"
                  color="primary"
                  size="sm"
                  className="w-full text-left"
                  onPress={handleLinkClick}
                >
                  Sign Up
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <NavbarItem>
          {/* Render the ShoppingCartSheet component when the badge is clicked */}
          <Badge
            content={cartItemCount}
            color="success"
            variant="solid"
            showOutline={false}
            isInvisible={cartItemCount === 0}
          >
            <ShoppingCartSheet />
          </Badge>
        </NavbarItem>
        {status === 'authenticated' && isUser && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="cursor-pointer bg-white"
                src={session.user.image}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <Link
                  color="foreground"
                  href="/customer-profile"
                  className="flex flex-col items-start"
                  onPress={handleLinkClick}
                >
                  <p className="font-semibold">Welcome</p>
                  <p>{session.user.name}</p>
                </Link>
              </DropdownItem>
              <DropdownItem key="orders" className="gap-2">
                <Link
                  color="foreground"
                  href="/customer-profile/orders"
                  className="flex flex-col items-start"
                >
                  <p className="font-semibold">Your Orders</p>
                </Link>
              </DropdownItem>
              <DropdownItem key="reviews" className="gap-2">
                <Link
                  color="foreground"
                  href="/customer-profile/my-reviews"
                  className="flex flex-col items-start"
                >
                  <p className="font-semibold">My reviews</p>
                </Link>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                variant="solid"
                onPress={() => {
                  signOut({ callbackUrl: '/' })
                  setIsMenuOpen(false) // Close menu when logging out
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      {/* Modify NavbarMenu to conditionally render based on isMenuOpen */}
      {isMenuOpen && (
        <NavbarMenu className="mt-6 text-center ">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={index}>
              <Link
                color="foreground"
                href={item.href}
                className="w-full "
                size="lg"
                onPress={handleLinkClick} // Close the menu after clicking a link
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          {/* Mobile version of Shop Dropdown */}
          {/*<NavbarMenuItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="w-1/2 text-center text-lg mt-4"
                  endContent={<ChevronDown size={20} />}
                  radius="sm"
                  variant="flat"
                >
                  Shop
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Shop categories" className="w-full">
                {shopCategories.map((category) => (
                  <DropdownItem key={category.label} className="relative gap-2">
                    <Link
                      href={category.href}
                      className="w-full flex items-center font-bold"
                      onClick={handleLinkClick} // Close menu when clicking a category link
                    >
                      {category.label}
                    </Link>

                    {category.subcategories.length > 0 && (
                      <div className="pl-4  flex flex-col">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.label}
                            href={subcategory.href}
                            className="text-sm mt-4 text-default-500 hover:text-primary w-full"
                            onClick={handleLinkClick} // Close menu when clicking a subcategory link
                          >
                            {subcategory.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarMenuItem>*/}
        </NavbarMenu>
      )}
    </Navbar>
  )
}
