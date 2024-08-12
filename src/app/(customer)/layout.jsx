import MainNavbarCustomer from '@/src/components/Navbar/CustomerNavbar'
import { CartProvider } from '@/src/context/CartContext'

export default function CustomerRootLayout({ children }) {
  return (
    <div className=" bg-slate-50">
      <CartProvider>
        <MainNavbarCustomer />
        {children}
      </CartProvider>
    </div>
  )
}
