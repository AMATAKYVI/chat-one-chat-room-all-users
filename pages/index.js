import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import moment from 'moment';
export default function Home() {
  const viewRef = useRef(null);
  const [chat, setChat] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [signInWithGoogle, userSignIn, userLoading, userError] =
    useSignInWithGoogle(auth);
  const chatRef = collection(db, 'chat');
  const q = query(chatRef, orderBy('timestamp', 'asc'));
  const [chatValues, chatLoading, chatError, chatSnapshot] =
    useCollectionData(q);

  const scrollDown = () => {
    viewRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };
  const handleSubmitChat = async () => {
    console.log(chat);
    await addDoc(collection(db, 'chat'), {
      chat: chat,
      uid: user.uid,
      photoURL: user.photoURL,
      timestamp: serverTimestamp(),
    });
    console.log(user);
    scrollDown();
    setChat('');
  };
  const sender = '';
  const receiver = '';
  return (
    <div className="relative  bg-slate-800">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {user ? (
          <div className="flex justify-between items-center px-5 bg-gray-900 text-white text-lg py-5">
            <div className="font-semibold ">{user.displayName}</div>
            <div className="flex items-center gap-5">
              <div className="text-green-500">Online</div>
              <div
                className="bg-blue-700 px-3 py-2 rounded-lg cursor-pointer"
                onClick={() => signOut(auth)}
              >
                Log out
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between px-5 bg-gray-900 text-white text-lg py-5">
            <button
              className="bg-blue-700 font-bold px-3 py-2 rounded-lg"
              onClick={() => signInWithGoogle()}
            >
              Login to Chat
            </button>
          </div>
        )}
        <div className="relative">
          {user ? (
            chatValues?.map((item) => {
              return (
                <div className="relative mt-5 mb-2" key={item.timestamp}>
                  {item.uid === user?.uid ? (
                    <div>
                      <div className=" text-xs text-gray-500 border-b w-fit mx-auto pb-2">
                        {moment(item.timestamp?.toDate()).fromNow()}
                      </div>
                      <div className="flex items-center gap-5 bg-blue-100 ml-auto mr-5 w-fit rounded-lg  pr-3 pl-10 py-2">
                        <p>{item.chat}</p>
                        <img
                          src={user.photoURL}
                          className="w-8 rounded-full"
                          alt=""
                        />
                      </div>
                      <div ref={viewRef}></div>
                    </div>
                  ) : (
                    <div>
                      <div className=" text-xs text-gray-500 border-b w-fit mx-auto pb-2">
                        {moment(item.timestamp.toDate()).fromNow()}
                      </div>
                      <div className="flex items-center gap-5 bg-red-100 mr-auto ml-5 w-fit rounded-lg  pl-3 pr-10 py-2">
                        <img
                          src={item.photoURL}
                          className="w-8 rounded-full"
                          alt=""
                        />
                        <p> {item.chat}</p>
                      </div>
                      <div ref={viewRef}></div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div>Please login</div>
          )}
        </div>
        <div className="sticky bottom-0 items-center flex w-full bg-gray-900 py-2">
          <input
            type="text"
            name=""
            id=""
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            placeholder="Messages..."
            className="bg-white w-full py-3 px-5 text-lg tracking-wide"
          />
          <button
            className="px-10 py-3  bg-blue-700 rounded-lg text-lg font-semibold"
            onClick={() => handleSubmitChat()}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
