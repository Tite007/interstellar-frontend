import MainNavbarCustomer from '@/src/components/Navbar/CustomerNavbar'
import { CartProvider } from '@/src/context/CartContext'
import CustomerChatBox from '@/src/components/customer/CustomerChatBox' // Adjust the path as needed

export default function CustomerRootLayout({ children }) {
  return (
    <div className="">
      <CartProvider>
        <MainNavbarCustomer />
        {children}
        {/* <CustomerChatBox /> {/* Added here */}
      </CartProvider>
    </div>
  )
}
