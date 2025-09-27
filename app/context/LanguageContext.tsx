import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'mr';

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

const translations: Translations = {
  dashboard: {
    en: 'Dashboard',
    mr: 'डॅशबोर्ड',
  },
  contactUs: {
    en: 'Contact and Support',
    mr: 'संपर्क आणि सहायता',
  },
  contactUsMenu: {
    en: 'Contact Us',
    mr: 'संपर्क साधा',
  },
  applyIdCard: {
    en: 'My ID Card',
    mr: 'माझे ओळखपत्र',
  },
  issuesAndHelp: {
    en: 'Issues and Help',
    mr: 'समस्या आणि मदत',
  },
  labourLaws: {
    en: 'Labour Laws',
    mr: 'कामगार कायदे',
  },
  socialHandles: {
    en: 'Social Handles',
    mr: 'सोशल लिंक्स',
  },
  shareApp: {
    en: 'Share This App',
    mr: 'ॲप शेअर करा',
  },
  changeLanguage: {
    en: 'भाषा मराठी करा',
    mr: 'Language to English',
  },
  profile: {
    en: 'Profile',
    mr: 'प्रोफाइल',
  },
  profileMobileNumber: {
    en: 'Mobile Number',
    mr: 'मोबाइल नंबर',
  },
  profileEmail: {
    en: 'Email',
    mr: 'ईमेल',
  },
  profileCompanyName: {
    en: 'Company Name',
    mr: 'कंपनीचे नाव',
  },
  profileDesignation: {
    en: 'Designation / Job profile',
    mr: 'पद',
  },
  profileRegistrationNumber: {
    en: 'Registration Number',
    mr: 'सभासद क्रमांक',
  },
  editProfileTitle: {
    en: 'Edit Profile',
    mr: 'प्रोफाइल संपादित करा',
  },
  editProfileName: {
    en: 'Enter User Name',
    mr: 'वापरकर्त्याचे नाव प्रविष्ट करा',
  },
  editProfileEmail: {
    en: 'Please Enter Email Address',
    mr: 'कृपया ईमेल पत्ता प्रविष्ट करा',
  },
  editProfileCompanyName: {
    en: 'Please Enter Company Name',
    mr: 'कृपया कंपनीचे नाव प्रविष्ट करा',
  },
  editProfileDesignation: {
    en: 'Please Enter Designation',
    mr: 'कृपया पद प्रविष्ट करा',
  },
  editProfileAddress: {
    en: 'Enter an address',
    mr: 'पत्ता प्रविष्ट करा',
  },

  profileAddress: {
    en: 'Address',
    mr: 'पत्ता',
  },
  editProfileSave: {
    en: 'SAVE PROFILE',
    mr: 'प्रोफाइल जतन करा',
  },
  editProfileSelectPicture: {
    en: 'Select Profile Picture',
    mr: 'प्रोफाइल चित्र निवडा',
  },
  editProfileChooseGallery: {
    en: 'Choose from Gallery',
    mr: 'गॅलरीमधून निवडा',
  },
  editProfileCancel: {
    en: 'Cancel',
    mr: 'रद्द करा',
  },
  news: {
    en: 'News and New Information',
    mr: 'बातम्या आणि नवीन माहिती',
  },
  noData: {
    en: 'No Data',
    mr: 'माहिती उपलब्ध नाही',
  },
  logout: {
    en: 'Logout',
    mr: 'बाहेर पडा',
  },
  logoutConfirm: {
    en: 'Are you sure you want to logout?',
    mr: 'तुम्हाला खरोखर बाहेर पडायचे आहे का?',
  },
  cancel: {
    en: 'Cancel',
    mr: 'रद्द करा',
  },
  login: {
    en: 'Login',
    mr: 'लॉगिन',
  },
  enterPhone: {
    en: 'Enter Phone Number',
    mr: 'फोन नंबर टाका',
  },
  getOtp: {
    en: 'Get OTP',
    mr: 'OTP मिळवा',
  },
  error: {
    en: 'Error',
    mr: 'त्रुटी',
  },
  invalidPhone: {
    en: 'Please enter a valid 10-digit phone number',
    mr: 'कृपया 10 अंकी फोन नंबर टाका',
  },
  verifyOtp: {
    en: 'Verify OTP',
    mr: 'OTP सत्यापित करा',
  },
  otpSent: {
    en: 'OTP has been sent to',
    mr: 'आपल्या मोबाइल फोनवर ओ टी पी पाठवला आहे, तो खाली टाका',
  },
  enterOtp: {
    en: 'Enter OTP',
    mr: 'OTP टाका',
  },
  verify: {
    en: 'Verify',
    mr: 'व्हेरिफाय करा',
  },
  invalidOtp: {
    en: 'Please enter a valid 6-digit OTP',
    mr: 'कृपया 6 अंकी OTP टाका',
  },
  didntReceiveOtp: {
    en: "Didn't receive OTP?",
    mr: 'OTP मिळाला नाही?',
  },
  resend: {
    en: 'Resend',
    mr: 'पुन्हा पाठवा',
  },
  personalInfo: {
    en: 'Personal Information',
    mr: 'वैयक्तिक माहिती',
  },
  name: {
    en: 'Name',
    mr: 'नाव',
  },
  phone: {
    en: 'Phone',
    mr: 'फोन',
  },
  address: {
    en: 'Address',
    mr: 'पत्ता',
  },
  other: {
    en: 'Other',
    mr: 'इतर',
  },
  profileTitle: {
    en: 'Profile',
    mr: 'प्रोफाइल',
  },
  change: {
    en: 'Change',
    mr: 'बदला',
  },
  remove: {
    en: 'Remove',
    mr: 'हटवा',
  },
  chooseFromGallery: {
    en: 'Choose from Gallery',
    mr: 'गॅलरीमधून निवडा',
  },
  verifyTitle: {
    en: 'Verify Your Number',
    mr: 'आपला नंबर व्हेरिफाय करा',
  },
  verifySubtitle: {
    en: 'Please enter your mobile number to receive a verification code.',  
    mr: 'ओ टी पी मिळविण्यासाठी आपला मोबाइल क्रमांक टाका.',
  },
  mobileNumber: {
    en: 'Mobile Number',
    mr: 'मोबाइल नंबर',
  },
  continue: {
    en: 'Continue',
    mr: 'पुढे',
  },
  welcome: {
    en: 'Welcome !',
    mr: 'स्वागत आहे!',
  },
  membershipRegistration: {
    en: 'Membership Registration',
    mr: 'सभासद नोंदणी',
  },
  removeImage: {
    en: 'Are you sure you want to remove the selected image?',
    mr: 'आपण निवडलेल्या चित्राचे हटवण्याची खात्री करा?',
  },
  removeImageTitle: {
    en: 'Remove Image',
    mr: 'चित्र हटवा',
  },
  };

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 