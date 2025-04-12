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
    en: 'Contact Us',
    mr: 'संपर्क करा',
  },
  applyIdCard: {
    en: 'Apply for ID Card',
    mr: 'आयडी कार्डसाठी अर्ज करा',
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
    mr: 'सोशल मीडिया',
  },
  shareApp: {
    en: 'Share This App',
    mr: 'ॲप शेअर करा',
  },
  changeLanguage: {
    en: 'Change Language to Marathi',
    mr: 'भाषा मराठी करा',
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
    en: 'Designation',
    mr: 'पदनाम',
  },
  profileRegistrationNumber: {
    en: 'Registration Number',
    mr: 'नोंदणी क्रमांक',
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
    mr: 'कृपया पदनाम प्रविष्ट करा',
  },
  editProfileAddress: {
    en: 'Enter an address',
    mr: 'पत्ता प्रविष्ट करा',
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
    mr: 'OTP पाठवला आहे',
  },
  enterOtp: {
    en: 'Enter OTP',
    mr: 'OTP टाका',
  },
  verify: {
    en: 'Verify',
    mr: 'सत्यापित करा',
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