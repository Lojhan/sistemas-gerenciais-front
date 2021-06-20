import { AuthCredentialsDto } from '@/classes/auth-credentials.dto'
import { axiosInstance as axios, axiosPayment, axiosVending } from './axios'
import { TOKEN } from './constants'

export default {
    signUp: (authCredentialsDto: AuthCredentialsDto) => axios.post('auth/signup', authCredentialsDto.createObject()),

    signIn: (username: string, password: string) => axios.post('auth/signin', { username, password, type: 'user' }),

    products: () => axios.get('products'),

    productsRaw: () => axios.get('products/raw'),

    toReceive: () => axiosPayment.get('payment-ticket'),

    logs: () => axios.get('logs'),
    
    marketLogs: () => axios.get('market-logs'),
    
    stocks: () => axios.get('storage'),
    
    getAverage: (uuid: string) => axios.get('market-logs/average/' + uuid),

    createProduct: (product: any) => axios.post('products', product),

    createStorage: (
        name: string, 
        address: string
    ) => axios.post('storage', { 
        name, 
        address
        }
    ),

    transferStorage: (
        product_uuid: string, 
        origin_uuid: string, 
        target_uuid: string, 
        delta: number, 
        value: number
    ) => axios.post('products/storage/transfer', {
        product_uuid, 
        origin_uuid, 
        target_uuid, 
        delta, 
        value
        }
    ),

    updateStorageData: (
        quantity: number, 
        in_stock_price: number, 
        stock_uuid: string, 
        product_uuid: string, 
    ) => axios.post('products/storage/edit_in_storage', {
        product_uuid, 
        stock_uuid, 
        in_stock_price, 
        quantity
        }
    ),

    changeQuantityFromStorage: (
        stock_uuid: string, 
        product_uuid: string, 
        delta: number, 
        reason: string,
        unity_price: number,
        aditional_data: any
    ) => axios.post('products/storage/change_quantity', {
        product_uuid, 
        stock_uuid, 
        delta, 
        reason,
        unity_price,
        aditional_data
        }
    ),

    checkQuantity: (
        stock_uuid: string, 
        product_uuid: string, 
    ) => axios.post('products/storage/check_quantity', {
        product_uuid, 
        stock_uuid, 
        }
    ),

    getAllSalesforUser: () => axiosVending.get('sales')
}