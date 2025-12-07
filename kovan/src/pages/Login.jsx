import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Lütfen tüm alanları doldurun');
        setLoading(false);
        return;
      }

      let loginEmail = email;

      // Check if user entered username instead of email
      if (!email.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          loginEmail = userDoc.data().email;
        } else {
          setError('Kullanıcı adı bulunamadı');
          setLoading(false);
          return;
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const user = userCredential.user;

      console.log('Login - Firebase Auth UID:', user.uid);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('Login - Firestore document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Login - User data from Firestore:', userData);
        
        localStorage.setItem('currentUserId', user.uid);
        localStorage.setItem('userData', JSON.stringify({
          name: userData.name,
          email: userData.email,
          headline: userData.headline || 'Gönüllü',
          avatarUrl: userData.avatarUrl || ''
        }));

        navigate('/');
      } else {
        setError('Kullanıcı profili bulunamadı');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı');
          break;
        case 'auth/wrong-password':
          setError('Hatalı şifre');
          break;
        case 'auth/invalid-credential':
          setError('Geçersiz e-posta/kullanıcı adı veya şifre');
          break;
        case 'auth/too-many-requests':
          setError('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin');
          break;
        default:
          setError('Giriş yapılırken bir hata oluştu');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      let userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          headline: 'Gönüllü',
          avatarUrl: user.photoURL || '',
          stats: { followers: 0, following: 0, posts: 0 },
          badges: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        userDoc = await getDoc(doc(db, 'users', user.uid));
      }

      const userData = userDoc.data();

      localStorage.setItem('currentUserId', user.uid);
      localStorage.setItem('userData', JSON.stringify({
        name: userData.name,
        email: userData.email,
        headline: userData.headline,
        avatarUrl: userData.avatarUrl
      }));

      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google ile giriş yapılırken bir hata oluştu');
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Giriş Yap
          </h1>
          <p className="text-gray-600">Türkiye Dijital Gönüllülük Platformu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email veya Kullanıcı Adı
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com veya kullaniciadi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi giriniz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁' : '👁'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                Beni hatırla
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Giriş yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-500 font-medium">VEYA</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="space-y-3">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Google ile Giriş Yap
            </button>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600 text-sm">
            Hesabın yok mu?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Kayıt Ol
            </Link>
          </p>
          <p className="text-gray-500 text-xs mt-4">
            <Link to="/privacy" className="hover:text-blue-600">
              Gizlilik Politikası
            </Link>
            {' '} • {' '}
            <Link to="/terms" className="hover:text-blue-600">
              Kullanım Şartları
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
