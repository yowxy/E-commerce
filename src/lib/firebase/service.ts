import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from './init';
import bcrypt from 'bcrypt';    

const firestore = getFirestore(app);

export async function retrieveData(CollectionName: string){
    const snapshot = await getDocs(collection(firestore,CollectionName));
    const data = snapshot.docs.map((doc) => (
        {
            id: doc.id, 
            ...doc.data()
        }
    ));
    return data;
}

export async function retrieveDataById(CollectionName: string, id: string){
    const snapshot = await getDoc(doc(firestore,CollectionName, id));
    const data = snapshot.data();
    return data;
}


export async function signUp(UserData: {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    role?: string;
}, callback:Function){
    const q = query(
        collection(firestore, "users"),
        where("email", "==", UserData.email)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => (
    {
        Id: doc.id,
        ...doc.data(),
    }
    ));

    if (data.length > 0) {
        callback(false);
    } else {
        if(!UserData.role){
            UserData.role = 'member';   
        }
        UserData.password = await bcrypt.hash(UserData.password, 10);
        await addDoc(collection(firestore, "users"), UserData)
        .then(() => {
            callback(true);
        })
        .catch((error) => {
            callback(false);
            console.log(error)
        });
    }
}