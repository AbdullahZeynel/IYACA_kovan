import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    username: '',
    city: '',
    interests: [],
    bio: '',
    skills: []
  });

  const [errors, setErrors] = useState({});

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 
    'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay',
    'Manisa', 'Kayseri', 'Samsun', 'Balıkesir', 'Kahramanmaraş', 'Van',
    'Aydın', 'Denizli', 'Sakarya', 'Tekirdağ', 'Muğla', 'Eskişehir'
  ];

  const interestOptions = [
    'Eğitim', 'Sağlık', 'Çevre', 'Teknoloji', 'Sanat & Kültür',
    'Spor', 'Sosyal Sorumluluk', 'Hayvan Hakları', 'Yaşlı Bakımı',
    'Çocuk Gelişimi', 'Afet Yönetimi', 'Gıda Yardımı'
  ];

  const skillOptions = [
    'Yazılım Geliştirme', 'Grafik Tasarım', 'Sosyal Medya Yönetimi',
    'Proje Yönetimi', 'İletişim', 'Organizasyon', 'Eğitim & Öğretim',
    'Sağlık Hizmetleri', 'Tercümanlık', 'Fotoğrafçılık', 'Video Prodüksiyon',
    'Muhasebe', 'Hukuk', 'Psikolojik Danışmanlık'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'Ad gerekli';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Soyad gerekli';
    if (!formData.email?.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (!formData.phone) {
      newErrors.phone = 'Telefon gerekli';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Telefon numarası 10 haneli olmalı';
    }
    if (!formData.birthDate) newErrors.birthDate = 'Doğum tarihi gerekli';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.username?.trim()) newErrors.username = 'Kullanıcı adı gerekli';
    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    if (!agreedToTerms) newErrors.terms = 'Kullanım şartlarını kabul etmelisiniz';
    if (!agreedToPrivacy) newErrors.privacy = 'Gizlilik politikasını kabul etmelisiniz';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.city) newErrors.city = 'Şehir seçin';
    if (formData.interests.length === 0) newErrors.interests = 'En az bir ilgi alanı seçin';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        username: formData.username,
        city: formData.city,
        interests: formData.interests,
        skills: formData.skills,
        bio: formData.bio,
        headline: 'Gönüllü',
        location: formData.city,
        avatarUrl: '',
        bannerUrl: '',
        stats: {
          followers: 0,
          following: 0,
          posts: 0
        },
        badges: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      localStorage.setItem('currentUserId', user.uid);
      localStorage.setItem('userData', JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        headline: 'Gönüllü',
        avatarUrl: ''
      }));

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Kayıt Ol
          </h1>
          <p className="text-gray-600">Türkiye Dijital Gönüllülük Platformu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm">⚠️ {errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Adınız"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Soyadınız"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ornek@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                      +90
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5XX XXX XX XX"
                      maxLength="10"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="kullaniciadi"
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="En az 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Şifrenizi tekrar girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Kullanım Şartlarını
                      </a>{' '}
                      okudum ve kabul ediyorum *
                    </span>
                  </label>
                  {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      <a href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                        Gizlilik Politikasını
                      </a>{' '}
                      okudum ve kabul ediyorum *
                    </span>
                  </label>
                  {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şehir *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Şehir seçin</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">İlgi Alanları * (En az 1)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                          formData.interests.includes(interest)
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {errors.interests && <p className="text-red-500 text-sm mt-2">{errors.interests}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Yetenekler (Opsiyonel)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {skillOptions.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                          formData.skills.includes(skill)
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hakkında (Opsiyonel)</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kendinizden bahsedin..."
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Geri
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition"
                >
                  İleri
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    '🚀 Kayıt Ol'
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Zaten hesabın var mı?{' '}
              <a href="/login" className="text-blue-600 font-bold hover:underline">
                Giriş Yap
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
