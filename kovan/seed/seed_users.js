const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  const userId = "exampleUser123";

  await setDoc(doc(db, "users", userId), {
    avatarUrl: "",
    bannerUrl: "",
    bio: "",
    city: "",
    konum: "",
    phoneNumber: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    headline: "Gönüllü",
    stats: {
      followers: 0,
      following: 0,
      hours: 0,
      posts: 0,
      projects: 0
    },
    badges: [],
    connections: []
  });

  console.log("User seeded!");
}

seed();