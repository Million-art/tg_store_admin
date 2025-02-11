import { Product } from '../interface/product'
import { Category } from '../interface/category'  
import { db } from './firebase' 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'

// Firestore Collection Reference for products
const productsCollectionRef = collection(db, 'products')

// Add Product
export const addProduct = async (categoryId: string, name: string, price: number, image: string, quantity: number, description?: string) => {
  try {
    const docRef = await addDoc(productsCollectionRef, {
      categoryId,
      name,
      price,
      image,
      quantity,
      description,
      createdAt: new Date(),
    })
    return docRef.id  
  } catch (error) {
    console.error('Error adding product: ', error)
    throw error
  }
}

// Get Products by Category
export const getProducts = async (categoryId: string) => {
  try {
    const q = query(productsCollectionRef, where("categoryId", "==", categoryId))
    const querySnapshot = await getDocs(q)
    const products: Product[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()

      // Check if all the necessary fields are available in the data
      if (data.name && data.price && data.image && data.quantity) {
        // Fetch category details if required
        const productCategory: Category = {
          id: categoryId,
          name: data.categoryName || 'Default Category',  
          description: data.categoryDescription || 'No description',  
        }

        // Ensure the data follows the Product interface
        const product: Product = {
          id: doc.id,
          name: data.name,
          image: data.image,
          price: data.price,
          quantity: data.quantity,
          description: data.description,  
          category: productCategory  
        }
        products.push(product)
      } else {
        console.error(`Missing required fields for product: ${doc.id}`)
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products: ', error)
    throw error
  }
}

// Update Product
export const updateProduct = async (id: string, name: string, price: number, image: string, quantity: number, description?: string) => {
  try {
    const productDocRef = doc(db, 'products', id)
    await updateDoc(productDocRef, { name, price, image, quantity, description })
  } catch (error) {
    console.error('Error updating product: ', error)
    throw error
  }
}

// Delete Product
export const deleteProduct = async (id: string) => {
  try {
    const productDocRef = doc(db, 'products', id)
    await deleteDoc(productDocRef)
  } catch (error) {
    console.error('Error deleting product: ', error)
    throw error
  }
}
