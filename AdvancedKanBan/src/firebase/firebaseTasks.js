import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const tasksCollection = collection(db, 'tasks');

export const getTasksFromFirebase = async (userId) => {
  const tasksSnapshot = await getDocs(tasksCollection);
  return tasksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const saveTaskToFirebase = async (task, userId) => {
  return await addDoc(tasksCollection, { ...task, userId });
};

export const updateTaskInFirebase = async (taskId, updatedTask) => {
  const taskRef = doc(db, 'tasks', taskId);
  return await updateDoc(taskRef, updatedTask);
};
