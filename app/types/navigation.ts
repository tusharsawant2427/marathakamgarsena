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
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 