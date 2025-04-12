import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  OtpScreen: undefined;
  Dashboard: undefined;
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
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 