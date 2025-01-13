// /src/firebase/firestoreService.ts
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Check if username exists
export const checkUsernameExists = async (username: string) => {
  const q = query(collection(db, 'userlogin'), where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Check user credentials
export const checkUserCredentials = async (email: string, password: string) => {
  try {
    const q = query(
      collection(db, 'userlogin'),
      where('email', '==', email),
      where('password', '==', password)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const user = querySnapshot.docs[0].data();
    return user; // Includes username, email, etc.
  } catch (error) {
    console.error('Error checking user credentials:', error);
    throw error;
  }
};

// Add employee details
export const addEmpDetails = async (empData: object) => {
  try {
    const docRef = await addDoc(collection(db, 'emp_details'), empData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding employee details:', error);
    throw error;
  }
};

// Add publisher details
export const addPubDetails = async (pubData: object) => {
  try {
    const docRef = await addDoc(collection(db, 'pub_details'), pubData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding publisher details:', error);
    throw error;
  }
};

// Add user login
export const addUserLogin = async (loginData: object) => {
  try {
    const docRef = await addDoc(collection(db, 'userlogin'), loginData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding user login:', error);
    throw error;
  }
};

// Add Job Post
export const addJobPost = async (jobData: object) => {
  try {
    const docRef = await addDoc(collection(db, 'jobposts'), jobData);
    return docRef.id; // Return the document ID for reference
  } catch (error) {
    console.error('Error adding job post:', error);
    throw error;
  }
};

