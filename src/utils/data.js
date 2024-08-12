import { ConnectMongoDB } from '@/src/components/utils'
import { Customers } from '@/src/libs/models/UserModel'

export const fetchCustomers = async () => { 
    try {
        ConnectMongoDB()
const customers  = await Customers.find()
        return customers
    } catch (error) {
        console.error(error)
        throw new Error('Error fetching customers')
    }
}