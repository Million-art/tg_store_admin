import { db } from "./firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore"

const COLLECTION_NAME = "categories"

export const addCategory = async (name: string) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), { name })
    return docRef.id
  } catch (error) {
    console.error("Error adding category: ", error)
    throw error
  }
}

export const updateCategory = async (id: string, name: string) => {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(categoryRef, { name })
  } catch (error) {
    console.error("Error updating category: ", error)
    throw error
  }
}

export const deleteCategory = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    console.error("Error deleting category: ", error)
    throw error
  }
}

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting categories: ", error)
    throw error
  }
}

