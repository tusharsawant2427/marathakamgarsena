import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  OtpScreen: {
    phoneNumber: string;
  };
  Registration: {
    phoneNumber?: string;
    token?: string;
  };
  Dashboard: undefined;
  News: undefined;
  ContactUs: undefined;
  Issues: undefined;
  AddIssue: undefined;
  LaborLaws: undefined;
  PdfViewer: {
    pdfUrl: string;
    title: string;
  };
  Notifications: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ApplyIDCard: undefined;
  NewsDetail: {
    news: {
      id: number;
      name: string;
      doc_name: string;
      content: string;
      file_name: string;
      doc_url?: string;
      news_link?: string;
      language: string;
      is_active: number;
      addedby: number;
      created_at: string;
      updated_at: string;
    };
  };
  ImageViewer: { imageUrl: string; title: string };
  // Payment Screens
  PaymentWebView: {
    webviewUrl: string;
    orderId: string;
    amount?: string;
    description?: string;
  };
  PaymentSuccess: {
    orderId: string;
    amount?: string;
    description?: string;
  };
  PaymentFailed: {
    orderId: string;
    amount?: string;
    description?: string;
    errorMessage?: string;
  };
  PaymentPending: {
    orderId: string;
    amount?: string;
    description?: string;
  };
  PaymentHistory: {
    userId?: number;
  };
  ExamplePayment: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
